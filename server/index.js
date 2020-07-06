const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const initData = require('./data.json')
console.log(initData[0])
let mark = 0
function getData() {
  mark += 20
  let resData = initData.filter((item, index) => index < mark)
  return JSON.stringify(resData)
}

server.on('open', function open() {
  console.log('connected');
});

server.on('close', function close() {
  console.log('disconnected');
});

server.on('connection', function connection(ws, req) {
  const ip = req.connection.remoteAddress;
  const port = req.connection.remotePort;
  const clientName = ip + port;

  console.log('%s is connected', clientName)

  // 发送欢迎信息给客户端
  ws.send("Welcome " + clientName);

  ws.on('message', function incoming(message) {
    console.log('received: %s from %s', message, clientName);
    
    // 广播消息给所有客户端
    console.log('clients--  ', server.clients)
    server.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        // client.send( clientName + " -> " + message);
        client.send(getData())
      }
    });

  });

});