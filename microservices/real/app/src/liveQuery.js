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
            +'@'+this.dbcred.hostname+':'+this.dbcred.port+'/'+this.dbcred.dbname;
    }

    constructor(value){
         if(!process.argv){
            this.dbcred={
              username:process.env.POSTGRES_USERNAME,
              password:process.env.POSTGRES_PASSWORD,
              hostname:process.env.POSTGRES_HOSTNAME,
              port:undefined,
              dbname:'hasuradb'
            }
            }
            else{
              this.dbcred={
                username:process.argv.uname,
                password:process.argv.pwd,
                hostname:process.argv.hname,
                port:process.argv.port,
                dbname:'hasuradb'
              }
            }
            this.liveDb=new LivePg(this.getConnectionString(), value||"ramu");

            process.on('SIGINT', function() {
                this.liveDb.cleanup(process.exit);
              });
    }

    select(query,handler){
        try{
        this.liveDb.select(query).on('update',handler);
        }catch(e){
            return e;
        }
    }

    close(){
        this.liveDb.cleanup(process.exit);
    }

    
}

module.exports=LiveQuery;