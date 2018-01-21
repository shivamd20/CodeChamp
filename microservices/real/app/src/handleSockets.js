
var token = "";

var socketIo = require('socket.io');
var LiveQuery = require('./liveQuery');
var fetchAction = require('node-fetch');
var builder = require('mongo-sql');
var request = require('request');

var axios = require('axios');

const clusterName = process.env.clusterName;

async function query(options ){

  return  await axios(options);

}

function queryData(q, token)
{
    var options={
        url:'https://data.'+clusterName+'.hasura-app.io/v1/query',
        data : q,
        method : 'post',
        json : true,
        headers : {
           Authorization : token || null,
            "Content-Type": "application/json",
        }
    }

     return query(options);
}


class HandleSocket {

    constructor(server) {

        this.io = socketIo(server);

        //this.io.set('origins', '*');

        this.liveQuery = new LiveQuery(process.argv, "first");
        this.onConnection = (socket) => {

            socket.selectMap = new Map();

           // socket.token='Bearer d79e6e8a76f6363a6f200969b55e6f550d3c593c60f16214';

            socket.on('querydata', (query, fn) => {

                queryData(query,socket.token)
                    .then(response => {

                        console.log(response);

                        if(fn)
                        fn({
                            "status": 'ok',
                            'data': response.data
                        });
                    })
                    .catch((err) => {
                              if(fn)
                                fn(
                                    {
                                        'status': 'error',
                                        'error': err.response.data
                                    });

                    console.log(err);
                        
                    });


            });

            socket.on("settoken", (data,fn)=>{

                socket.token=data;
                if(fn)
                fn({
                    status : 'okay',
                    message : 'auth token set'
                });

            })

            socket.on('subscribe', (data,key, fn) => {

                //   var  includediff = what.diff?true:false,
                //     includedata = what.data?true:false;

                console.log('key:  ' + key);

                queryData(data, socket.token)

                    .then((result) => {

                        console.log('permission granted')
                         console.log( JSON.stringify(result.data));
 
                        var sql = convertToString(data);

                        socket.selectMap.set(key, this.liveQuery.select(sql.query, sql.values, (diff, data) => {

                            socket.emit('datachange'+ key, data);

                            console.log("key: " + key + "  diff:  " + JSON.stringify(diff) + "  data: " + JSON.stringify(data));
                        }
                            , (e) => {

                               // console.log(e);
                               if(fn)
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

                        if(err.response){
                            errstr= err.response.data
                        }else{
                            errstr = err.toString();
                        }
                        
                        if(fn)
                        fn({
                            error: errstr,

                            cause: '1'

                        });

                    });


            });


            socket.on('unsubscribe', ( key, fn) => {
                
                var liveQuery=socket.selectMap.get(key);

                if(liveQuery){
                        liveQuery.stop();
                        liveQuery=null;

                        fn(key, {
                            status:'unsubscribed'
                        });
                }
                else

                fn(key, {
                    status:'key not subscribed'
                });

            });
        }

        this.io.on('connection', this.onConnection);
    }



    dataQuery(body, token) {


    }

}



function convertToString(jsonQuery) {

    if( !jsonQuery || !jsonQuery.args || !jsonQuery.args.table || !jsonQuery.args.columns ) return;

    console.log("json query");
    console.log(jsonQuery);
    var obj = {}
    if (jsonQuery.type === 'select') {
        obj.type = jsonQuery.type;
        obj.table = jsonQuery.args.table;


        var where={

        }

        if(jsonQuery.args.where)
        obj.where = jsonQuery.args.where;

        if(jsonQuery.args.order_by){

            obj.order =[]
            jsonQuery.args.order_by.forEach(element => {
                
                obj.order.push(""+element.column+" "+ (element.order || "") );

            });
        }


        obj.columns = jsonQuery.args.columns;
        var sql = builder.sql(obj);

        if(jsonQuery.args.limit){
            sql.query= sql.query+" limit "+jsonQuery.args.limit;
        }
    }
    else return;
    console.log("sql: ");
    console.log(sql.values);


    return sql;
}


module.exports = HandleSocket;

console.log(convertToString(
    {
        "type": "select",
        "args": {
            "table": "article",
            "columns": [
                "author_id",
                "content"
            ],
            "where": {
                "$eq": {
                    '$author_id':'ramu'
                }
            }
        }
    }
));

// queryData(JSON.stringify({
//     "type": "select",
//     "args": {
//         "table": "article",
//         "columns": [
//             "*"
//         ]
//     }
// })
// ,'Bearer d79e6e8a76f6363a6f200969b55e6f550d3c593c60f16214');