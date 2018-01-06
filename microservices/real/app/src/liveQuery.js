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
            +'@'+this.dbcred.hostname+':'+this.dbcred.port+'/'+this.dbcred.dbname+'?searchpath=public';
    }

    constructor(env,value){
       
            this.dbcred={
              username:process.env.POSTGRES_USERNAME || env[2],
              password:process.env.POSTGRES_PASSWORD || env [3],
              hostname:process.env.POSTGRES_HOSTNAME || env [4],
              port: process.env.POSTGRES_PORT || env [5] || 5432,
              dbname:env[6] || 'hasuradb'
            }
          

      ////      console.log(this.getConnectionString());
            this.liveDb=new LivePg(this.getConnectionString(), value||"ramu");

            process.on('SIGINT', ()=> {
                this.liveDb.cleanup(process.exit);
              });
    }

    select(query,handler,errorhandler){
      return  this.liveDb.select(query).on('update',handler).on('error',errorhandler);  
    }

    close(){
        this.liveDb.cleanup(process.exit);
    }

    
}

module.exports=LiveQuery;