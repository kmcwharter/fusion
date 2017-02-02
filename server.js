var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://' + host + ':' + port);
}


app.use(express.static('public'));

console.log("server connected");

var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('new connection: ' + socket.id);

  socket.on('type', typeMsg);

  function typeMsg(data) {
   Player1 = socket.broadcast.emit('type', data);
   // io.sockets.emit('type', data);
    console.log(data);
  }
}