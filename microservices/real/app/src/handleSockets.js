
class HandleSocket{

constructor(app){
    this.io = require('socket.io')(app);
    io.on('connection', function (socket) {
        socket.emit('news', { hello: 'world' });
        socket.on('my other event', function (data) {
          console.log(data);
        });
      });
}

}