
require('./env')();

var express = require('express');
var HandleSocket=require('./handleSockets');
var app = express();



var handleSocket=require('./handleSockets');
var path = require('path');

var server = require('http').Server(app);



//your routes here
app.get('/', function (req, res) {
    res.send("Hello World!");
});

// app.get('/client', function(req, res) {
//     res.sendFile(path.join(__dirname + '/client.html'));
// });

// app.get('/clientsocket',function(req,res){
//     res.sendFile(path.join(__dirname + '/node_modules/socket.io-client/dist/socket.io.js'));
// });

app.use(express.static('client'))

//var handleSocket=new HandleSocket(server);




server.listen(process.env.port || 8080, function () {
    console.log('Example app listening on port 8080!');
  });

  //console.log(process.env);
