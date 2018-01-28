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

    constructor(config , name){

            this.dbcred={
              username:config.POSTGRES_USERNAME || process.env.POSTGRES_USERNAME  ,
              password:config.POSTGRES_PASSWORD || process.env.POSTGRES_PASSWORD ,
              hostname:config.POSTGRES_HOSTNAME || process.env.POSTGRES_HOSTNAME || 'localhost',
              port: config.POSTGRES_PORT || process.env.POSTGRES_PORT || 5432,
              dbname:config.DB_NAME || process.env.DB_NAME || 'hasuradb'
            }
          

       //     console.log(this.getConnectionString());
            this.liveDb=new LivePg(this.getConnectionString(),  name || "ramu");

            process.on('SIGINT', ()=> {
                this.liveDb.cleanup(process.exit);
              });
    }

    select(query, values, handler,errorhandler){
      return  this.liveDb.select(query,values).on('update',handler).on('error',errorhandler);  
    }

    close(){
        this.liveDb.cleanup(process.exit);
    }

    
}

module.exports=LiveQuery;