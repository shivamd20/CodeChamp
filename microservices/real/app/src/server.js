var express = require('express');
var LiveQuery=require('./liveQuery');
var app = express();
var handleSocket=require('./handleSockets');

//your routes here
app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});






liveQuery=new LiveQuery(process.argv,"first");

liveQuery.select('select * from user',(diff,data)=>{
    console.log(JSON.stringify(diff)+"  data: "+JSON.stringify(data));
},(e)=>{console.log('error: '+e.toString())});
