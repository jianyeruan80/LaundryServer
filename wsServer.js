var WebSocketServer = require('websocket').server;
var http = require('http');
var clients={};
var clientsTest=[];
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
        try{
          var msg=JSON.parse(message);
         // clients[msg.user]=connection;
        }catch(ex){}
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
        //console.log(reasonCode,description);
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
io.socket.emit信息传输的对象为所有的client

ar WebSocket = require('websocket').server,
    Net       = require('net'),
    http      = require('http'),
    Dgram     = require('dgram'),
    unixPath  = '/tmp/wsbroadcaster.sock',
    unixSocket,
    udpSocket,
    wsServer,
    httpServer;

// Create HTTP Server
httpServer = http.createServer(function(request, response) {
  response.writeHead(404, {"Content-Type": 'text/plain'});
  response.write('Page Not Found.');
  response.end();
});
httpServer.listen(8124);

// Create WebSocket Server
wsServer = new WebSocket({
  httpServer:            httpServer,
  autoAcceptConnections: true
});

// WebSocket events
wsServer.on('connect', function(connection) {
  console.log('WebSocket connected.');
  connection.on('message', function(msg) {
    wsServer.broadcast(msg);
  })
});

// Create udp Socket
udpSocket = Dgram.createSocket('udp4');

udpSocket.on('message', function(message, info) {
  console.log('UDP request handled.');
  wsServer.broadcast(message.toString('utf8', 0, info.size));
});

udpSocket.on('listening', function() {
  console.log('UDP Server bound at ' + udpSocket.address().address + ':' + udpSocket.address().port);
});

udpSocket.bind(8125); // listening 0.0.0.0:8125

// Create Unix Socket
unixSocket = Net.createServer(function(connection) {
  console.log('UNIX Socket handled.');
  connection.setEncoding('utf8');
  connection.on('data', function(chunk) {
    wsServer.broadcast(chunk);
  });
})
unixSocket.listen(unixPath, function() {
  console.log('UNIX Socket bound.');
  // do something for listen started.
});

// SIGINT Event bind
process.on('SIGINT', function() {
  udpSocket.close();
  unixSocket.close();
  process.exit();
});
*/