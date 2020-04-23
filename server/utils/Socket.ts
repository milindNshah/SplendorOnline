"use strict"
import socketIO from 'socket.io';

let serverSocket: SocketIO.Server;

export function getIO(): SocketIO.Server {
  return serverSocket;
}

export function intializeSocket(server: any): SocketIO.Server {
  serverSocket = socketIO(server);
  return serverSocket;
}
