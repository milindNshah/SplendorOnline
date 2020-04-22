"use strict";
import { JoinRoomParams, Room, RoomService } from './models/Room';
import { getIO } from './socket';

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
  }
}
