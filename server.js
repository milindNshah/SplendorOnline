var bodyParser = require('body-parser');
var express = require('express');
// var http = require('http');
var opn = require('opn');
var path = require('path');
var socketIO = require('socket.io');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'src/client/')));
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

var port = normalizePort(process.env.PORT || '1234');
app.set('port', port);

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

opn('http://localhost:'+app.get('port'));
var server = app.listen(app.get('port'), function () {
  console.log('Server started at: http://localhost:' + app.get('port') + '/');
});
var io = socketIO(server);

// Add the WebSocket handlers
io.on('connection', function(socket) {
  "io connected";
});

setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);
