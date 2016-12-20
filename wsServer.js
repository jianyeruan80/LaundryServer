var WebSocketServer = require('websocket').server;
var http = require('http');
var clients={};
var groups={};
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
     autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        
        //if (message.type === 'utf8') {
           // console.log('Received Message: ' + message.utf8Data);
            connection.sendUTF(message.utf8Data);
       // }
       // else if (message.type === 'binary') {
          //  console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
          // connection.sendBytes(message.binaryData);
       // }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
/*
socket.emit(‘message’,data)信息传输对象为当前socket对应的client,各个client socket相互不影响
WebSocketServer broadcast
socket.broadcast.emit信息传输对象为所有client，排除当前socket对应的client
socket.on('request', function(request) {
  var connection = request.accept('any-protocol', request.origin);
  clients.push(connection);

  connection.on('message', function(message) {
    //broadcast the message to all the clients
    clients.forEach(function(client) {
      client.send(message.utf8Data);
    });
  });
});  ws.send(JSON.stringify({
      msg: {
        connectionId: userId
      }
    }));
io.socket.emit信息传输的对象为所有的client*/