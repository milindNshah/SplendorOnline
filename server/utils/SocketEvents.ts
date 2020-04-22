"use strict";
import { JoinRoomParams, Room } from '../models/Room'
import * as RoomService from '../services/RoomService'
import { getIO } from './SocketUtils'

export class SocketEvents {
  static initRoomEvents(socket: SocketIO.Socket): void {
    const io: SocketIO.Server = getIO();

    socket.on('createNewRoom', function (userName: string) {
      const room = RoomService.createNewRoom(userName, socket.id);
      socket.join(room.code);
      io.sockets.in(room.code).emit("joinedRoom", room);
    });

    socket.on('joinRoom', function (data: JoinRoomParams) {
      const room: Room = RoomService.joinRoom(
        data.userName,
        socket.id,
        data.roomCode
      );
      socket.join(room.code);
      io.sockets.in(room.code).emit("joinedRoom", room);
    });

    // TODO: Maybe send a specific event just to the requester
    // io.to(socketId).emit('hey', 'I just met you');
    // Send info: playerName/playerID so I can arrange by that instead of by socketID.
  }
}
