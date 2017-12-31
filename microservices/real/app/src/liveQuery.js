var fs = require('fs');
var path = require('path');
var LivePg = require('pg-live-select');


// // Load the SELECT query from an external file
// var QUERY = "select * from ramu";


// // Create a live select instance

// try{
// liveDb.select(QUERY)
//   .on('update', function(diff, data) {
//     // Handle the changes here...
//     console.log(diff, data);
//   });
// }catch(e){
// console.log(JSON.stringify(e));
// }

// // On Ctrl+C, remove triggers and exit


class LiveQuery{

    getConnectionString(){
            return 'postgres://'+this.dbcred.username+':'
            +this.dbcred.password
            +'@'+this.dbcred.hostname+'/'+this.dbcred.dbname;
    }

    constructor(env,value){
       
            this.dbcred={
              username:env.POSTGRES_USERNAME || env[2],
              password:env.POSTGRES_PASSWORD || env [3],
              hostname:env.POSTGRES_HOSTNAME || env [4],
              dbname:env[5] || 'hasuradb'
            }
          

            console.log(this.getConnectionString());
            this.liveDb=new LivePg(this.getConnectionString(), value||"ramu");

            process.on('SIGINT', function() {
                this.liveDb.cleanup(process.exit);
              });
    }

    select(query,handler,errorhandler){
        try{
        this.liveDb.select(query).on('update',handler).on('error',errorhandler);
        }catch(e){
            return e;
        }
    }

    close(){
        this.liveDb.cleanup(process.exit);
    }

    
}

module.exports=LiveQuery;