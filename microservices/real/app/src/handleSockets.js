var socketIo = require('socket.io');
var LiveQuery = require('./liveQuery');
var fetchAction = require('node-fetch');
var builder = require('mongo-sql');

function checkPermission(query, token) {
    var url = "https://data.circadian84.hasura-app.io/v1/query";
    var requestOptions = {
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "X-Hasura-User-Id":0,
            "X-Hasura-Role":'user'
          //  "Authorization": token,
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
        this.liveQuery = new LiveQuery(process.argv, "first");
        this.onConnection = (socket) => {

            socket.selectMap = new Map();

            socket.on('subscribe', (data,fn) => {

                var key=data.key,
                queryObject=data.queryObject;

                // console.log(socket.handshake.headers);
                
                checkPermission(queryObject, socket.handshake.headers['Authorization'])

                    .then((result) => {

                        console.log('permission granted' + JSON.stringify(result));

                        socket.selectMap.set(key, this.liveQuery.select(convertToString(queryObject), (diff, data) => {

                            socket.emit('query' + key, data);

                            console.log(JSON.stringify(diff) + "  data: " + JSON.stringify(data));
                        }
                            , (e) => { fn({error:e.toString()}) }))
                    }
                    )
                    .catch((err) => {
                    //    fn(err.toString());
                        err.then((json)=>{
                            fn({error:json});
                        }).catch(e=>{
                            fn({error:e.toString()});
                        });
                    });

            
            });


        }

        this.io.on('connection', this.onConnection);
    }



    dataQuery(body, token) {


    }

}

var body = {
    "type": "run-sql",
    "args": {
        "sql": "select * from user"
    }
};


function convertToString(jsonQuery){

    var obj=jsonQuery.type+" ";

  jsonQuery.args.columns.forEach(function(element) {
    
    {
        sql=sql+" '"+x+"' ";
    }

  }, this);
   

    sql=sql+" from '" +jsonQuery.args.table +"' ";



    console.log(sql);

    return sql;
}


module.exports = HandleSocket;