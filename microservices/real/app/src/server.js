var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var LivePg = require('pg-live-select');


var dbcred;

dbcred={
  username:process.env.POSTGRES_USERNAME,
  password:process.env.POSTGRES_PASSWORD,
  hostname:process.env.POSTGRES_HOSTNAME,
  port:process.env.POSTGRES_PORT,
  dbname:'hasuradb'
}

console.log(JSON.stringify(dbcred));
//your routes here
app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


// Update this line with your username/password/host/database
var CONN_STR = 'postgres://'+dbcred.username+':'
+dbcred.password
+'@'+dbcred.hostname+'/'+dbcred.dbname;
// Load the SELECT query from an external file
var QUERY = "select * from ramu";

// Initialize the live query processor
var liveDb = new LivePg(CONN_STR, 'mytest');

// Create a live select instance
liveDb.select(QUERY)
  .on('update', function(diff, data) {
    // Handle the changes here...
    console.log(diff, data);
  });

// On Ctrl+C, remove triggers and exit
process.on('SIGINT', function() {
  liveDb.cleanup(process.exit);
});