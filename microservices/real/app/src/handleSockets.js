

var socketIo = require('socket.io');
var LiveQuery = require('./liveQuery');
var builder = require('mongo-sql');

var axios = require('axios');

var liveQuery = new LiveQuery(process.argv, "first");


var isFunction = function (obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
};

async function query(options) {

    return await axios(options);

}


class HandleSocket {

    queryData(q, token) {
        var options = {
            url: 'https://data.' + this.clusterName + '.hasura-app.io/v1/query',
            data: q,
            method: 'post',
            json: true,
            headers: {
                Authorization: token || null,
                "Content-Type": "application/json",
            }
        }

        return query(options);
    }

    queryAuth(q, path, token){

        var options = {
            url: 'https://auth.' + this.clusterName + '.hasura-app.io/v1'+path,
            data: q,
            method: 'post',
            json: true,
            headers: {
                Authorization: token || null,
                "Content-Type": "application/json",
            }
        }

        return query(options);

    }
    
    onConnection (socket){

        socket.selectMap = new Map();

        socket.on('proxyrq', (options, fn)=>{

                query(options).then((response)=>{
                    if(isFunction(fn))
                    fn({
                        "status": 'ok',
                        'data': response.data,
                        "headers" : response.headers,
                        "statusCode" : response.status,
                        statusText : response.statusText
                    });
                }).catch((err) => {
                    if(isFunction(fn))
                    fn(
                        {
                            'status': 'error',
                            'error': err.response ? err.response.data : err.toString(),
                            "headers" : err.response ? err.response.headers : null,
                            "statusCode" :  err.response ? err.response.status : null,
                            statusText : err.response ? err.response.statusText : null
                        });

                    //     console.log(err);

                });

        });

        socket.on('queryauth', (query,path, fn) => {

            this.queryAuth(query,path, socket.token)
                .then(response => {

                    //  console.log(response);

                    if(isFunction(fn))
                    fn({
                        "status": 'ok',
                        'data': response.data
                    });
                })
                .catch((err) => {
                    if(isFunction(fn))
                    fn(
                        {
                            'status': 'error',
                            'error': err.response.data
                        });

                    //     console.log(err);

                });

              
        });

        socket.on('querydata', (query, fn) => {

            this.queryData(query, socket.token)
                .then(response => {

                    //  console.log(response);

                    if(isFunction(fn))
                    fn({
                        "status": 'ok',
                        'data': response.data,
                        "headers" : response.headers,
                        "statusCode" : response.status,
                        statusText : response.statusText
                    });
                })
                .catch((err) => {
                    if(isFunction(fn))
                    fn(
                        {
                            'status': 'error',
                            'error': err.response.data,
                            "headers" : err.response ? err.response.headers : null,
                            "statusCode" :  err.response ? err.response.status : null,
                            statusText : err.response ? err.response.statusText : null
                        });

                    //     console.log(err);

                });


        });

        socket.on("settoken", (data, fn) => {

            socket.token = data;
          if(  isFunction(fn))
            fn({
                status: 'okay',
                message: 'auth token set'
            });

        })

        socket.on('subscribe', (data, key, fn) => {

            //   var  includediff = what.diff?true:false,
            //     includedata = what.data?true:false;

            // console.log('key:  ' + key);

            if (socket.selectMap.get(key)) {
                socket.selectMap.get(key).stop();
            }

            this.queryData(data, socket.token)

                .then((result) => {

                    //   console.log('permission granted')
                    //   console.log( JSON.stringify(result.data));

                    var sql = convertToString(data);

                    socket.selectMap.set(key, liveQuery.select(sql.query, sql.values, (diff, data) => {

                        socket.emit('datachange' + key, data);

                        //    console.log("key: " + key + "  diff:  " + JSON.stringify(diff) + "  data: " + JSON.stringify(data));
                    }
                        , (e) => {

                            console.log(e);
                            if(isFunction(fn))
                            fn({
                                error: e.toString(),

                                cause: '2'
                            })
                        }))
                }
                )
                .catch((err) => {
                    //    fn(err.toString());

                    var errstr;

                    if (err.response) {
                        errstr = err.response.data
                    } else {
                        errstr = err.toString();
                    }

                    if(isFunction(fn))
                    fn({
                        error: errstr,

                        cause: '1'

                    });

                });
                
        });


        socket.on('unsubscribe', (key, fn) => {

            var lq = socket.selectMap.get(key);

            if (lq) {
                lq.stop();
                lq = undefined;
                socket.selectMap.push(key, undefined);

                if(isFunction(fn))
                fn(key, {
                    status: 'unsubscribed'
                });
            }
            else

            if(isFunction(fn))
            fn(key, {
                status: 'key not subscribed'
            });

        });

        if(isFunction(this.onCn))
        this.onCn(socket);
    }
 

    constructor(server, config, onCn) {

        this.onCn = onCn;

        if (!config) config = {};

        this.clusterName = config.CLUSETER_NAME || process.env.CLUSETER_NAME;

        liveQuery = new LiveQuery(config);


        this.io = socketIo(server);

        this.io.set('origins', '*');

      
        this.io.on('connection', this.onConnection);
    }

}



function convertToString(jsonQuery) {

    if (!jsonQuery || !jsonQuery.args || !jsonQuery.args.table || !jsonQuery.args.columns) return;

    // console.log("json query");
    // console.log(jsonQuery);
    var obj = {}
    if (jsonQuery.type === 'select') {
        obj.type = jsonQuery.type;
        obj.table = jsonQuery.args.table;


        var where = {

        }

        if (jsonQuery.args.where)
            obj.where = jsonQuery.args.where;

        if (jsonQuery.args.order_by) {

            obj.order = []
            jsonQuery.args.order_by.forEach(element => {

                obj.order.push("" + element.column + " " + (element.order || ""));

            });
        }


        obj.columns = jsonQuery.args.columns;
        var sql = builder.sql(obj);

        if (jsonQuery.args.limit) {
            sql.query = sql.query + " limit " + jsonQuery.args.limit;
        }
    }
    else return;
    // console.log("sql: ");
    // console.log(sql.values);


    return sql;
}


module.exports = HandleSocket;


