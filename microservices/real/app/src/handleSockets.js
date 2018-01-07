var socketIo = require('socket.io');
var LiveQuery = require('./liveQuery');
var fetchAction = require('node-fetch');
var builder = require('mongo-sql');

function queryData(query, token) {
   // var url = "https://data.circadian84.hasura-app.io/v1/query";


    var url = "http://data.hasura/v1/query";


    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": token,
        }
    };
    var body = query;
    requestOptions.body = JSON.stringify(body);
    return fetchAction(url, requestOptions)
        .then(function (res) {

            if(res.ok)
            return res.json();
            else{
                throw res.json();
            }
        })

    // .then(function(result) {
    //     console.log("success"+JSON.stringify(result));
    // })
    // .catch(function(error) {
    //     console.log('Request Failed:' + error);
    // });
}

class HandleSocket {

    constructor(server) {

        this.io = socketIo(server);

        //this.io.set('origins', '*');

        this.liveQuery = new LiveQuery(process.argv, "first");
        this.onConnection = (socket) => {

            socket.selectMap = new Map();

            socket.on('querydata',(query,fn)=>{

                queryData(query,socket.handshake.Authorization)
                .then(data=>{
                    fn({
                        "status":'ok',
                        'data':data
                });
                })
                .catch((err) => {
                    //    fn(err.toString());

                    if(err.then)
                        err.then((json)=>{
                            fn(
                                {'status':'error',
                                'error':json
                            });
                        }).catch(e=>{
                            fn(
                                {'status':'error',
                                'error':e.toString()
                            });
                        });

                    else fn(
                        {'status':'error',
                        'error':err.toString()
                    }
                    );
                        
                    });

            });

            socket.on('subscribe', (data,fn) => {

                var key=data.key,
                queryObject=data.queryObject,
                diff=data.diff,
                data=data.data;


                console.log('key:  '+key);
                
                queryData(queryObject, socket.handshake.headers['Authorization'])

                    .then((result) => {

                        console.log('permission granted' + JSON.stringify(result));

                        socket.selectMap.set(key, this.liveQuery.select(convertToString(queryObject), (diff, data) => {

                            socket.emit('datachange'+key, data);

                            console.log("key: "+key+"  diff:  "+JSON.stringify(diff) + "  data: " + JSON.stringify(data));
                        }
                            , (e) => { fn({error:e.toString(),
                                
                                    cause:'2'}) })) 
                    }
                    )
                    .catch((err) => {
                    //    fn(err.toString());

                    if(err.then)
                        err.then((json)=>{
                            fn({error:json,
                                
                                    cause:'3'});
                        }).catch(e=>{
                            fn({error:e.toString(),
                            
                                cause:'1'

                            });
                        });

                    else fn(err.toString());
                        
                    });
                
            
            });


        }

        this.io.on('connection', this.onConnection);
    }



    dataQuery(body, token) {


    }

}



function convertToString(jsonQuery){

    var obj={}
    if(jsonQuery.type==='select')
    {
   obj.type= jsonQuery.type;
   obj.table= jsonQuery.args.table;
   obj.where = jsonQuery.args.where;
   obj.columns = jsonQuery.args.columns;
   var sql=builder.sql(obj);
    }
   console.log("sql: ");
    console.log(sql.query);
    return sql.query;
}


module.exports = HandleSocket;