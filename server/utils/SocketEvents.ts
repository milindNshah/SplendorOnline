"use strict";
import { JoinRoomParams, Room, PlayerRoom } from '../models/Room'
import * as RoomService from '../services/RoomService'
import { getIO } from './SocketUtils'

export class SocketEvents {
  static initRoomEvents(socket: SocketIO.Socket): void {
    const io: SocketIO.Server = getIO();

    socket.on('createNewRoom', function (userName: string) {
      const playerRoom: PlayerRoom = RoomService.createNewRoom(userName, socket.id);
      const room = playerRoom.room;
      const player = playerRoom.player;
      socket.join(room.code);
      io.to(socket.id).emit("clientPlayerID", player.id);

      // TODO: figure out why room.players sends blank object on client.
      const players = Array.from(room.players.values());
      io.sockets.in(room.code).emit("joinedRoom", {room: room, players: players});
    });

    socket.on('joinRoom', function (data: JoinRoomParams) {
      const playerRoom: PlayerRoom = RoomService.joinRoom(
        data.userName,
        socket.id,
        data.roomCode
      );
      const room = playerRoom.room;
      const player = playerRoom.player;
      socket.join(room.code);
      io.to(socket.id).emit("clientPlayerID", player.id);

      const players = Array.from(room.players.values());
      io.sockets.in(room.code).emit("joinedRoom", {room: room, players: players});
    });
  }
}
