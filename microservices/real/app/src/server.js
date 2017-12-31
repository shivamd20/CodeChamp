var express = require('express');
var LiveQuery=require('./liveQuery');
var app = express();

//your routes here
app.get('/', function (req, res) {
    res.send("Hello World!");
});

app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});


liveQuery=new LiveQuery("first");


try{
liveQuery.select('select * from user',function(diff,data){
    console.log(JSON.stringify(diff)+"  data: "+JSON.stringify(data));
});
}catch(e){
  console.log(JSON.stringify(e));
}