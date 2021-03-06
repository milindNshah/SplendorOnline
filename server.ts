import bodyParser from 'body-parser';
import express from 'express';
import open from 'open';
import path from 'path';
import * as Socket from './server/utils/Socket';
import { SocketEvents } from './server/utils/SocketEvents';
import * as ErrorHandler from './server/utils/ErrorHandler';
import * as CardManager from './server/managers/CardManager';
import * as NobleManager from './server/managers/NobleManager';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.join(__dirname, 'src/client/')));
app.use(function (_req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Disable caching so we'll always get the latest comments.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// Force React to do the routing and prevent refresh error.
app.get('/*', function (_req, res) {
  res.sendFile(path.join(__dirname, 'src/client/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

let port = normalizePort(process.env.PORT || '7845');
app.set('port', port);

function normalizePort(val: any): any {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

open('http://localhost:' + app.get('port'));
const server = app.listen(app.get('port'), function () {
  console.log('Server started at: http://localhost:' + app.get('port') + '/');
});

const io = Socket.intializeSocket(server);
io.on('connection', function (socket) {
  SocketEvents.initRoomEvents(socket);
});

CardManager.generateAllCards();
NobleManager.generateAllNobles();

process.on('uncaughtException', async (err) => {
  await ErrorHandler.handleError(err);
});

process.on('unhandledRejection', async (err) => {
  await ErrorHandler.handleError(err);
});
