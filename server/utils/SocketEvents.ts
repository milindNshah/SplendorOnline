"use strict";
import { JoinRoomParams, Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import * as RoomService from '../services/RoomService'
import * as PlayerManager from '../PlayerManager'
import * as RoomManager from '../RoomManager'
import { getIO } from './SocketUtils'

export class SocketEvents {
  static initRoomEvents(socket: SocketIO.Socket): void {
    const io: SocketIO.Server = getIO();

    socket.on('disconnect', function () {
      const player: Player = PlayerManager.getPlayerBySocketID(socket.id);
      // Possible if client didn't join/create a room.
      if(player === null) {
        return;
      }
      const modifiedRooms: Room[] = RoomManager.removePlayerFromRooms(player.id);
      modifiedRooms.forEach((room) => {
        io.sockets.in(room.code).emit("updateRoom", {
          room: room,
          players: Array.from(room.players.values())
        });
      });
      PlayerManager.removePlayer(player);
    });

    socket.on('createNewRoom', function (userName: string) {
      const playerRoom: PlayerRoom = RoomService.createNewRoom(userName, socket.id);
      const room: Room = playerRoom.room;
      const player: Player = playerRoom.player;
      socket.join(room.code);
      io.to(socket.id).emit("clientPlayerID", player.id);

      // TODO: figure out why room.players sends blank object on client.
      const players = Array.from(room.players.values());
      io.sockets.in(room.code).emit("updateRoom", { room: room, players: players });
    });

    socket.on('joinRoom', function (data: JoinRoomParams) {
      const playerRoom: PlayerRoom = RoomService.joinRoom(
        data.userName,
        socket.id,
        data.roomCode
      );
      const room: Room = playerRoom.room;
      const player: Player = playerRoom.player;
      socket.join(room.code);
      io.to(socket.id).emit("clientPlayerID", player.id);

      const players = Array.from(room.players.values());
      io.sockets.in(room.code).emit("updateRoom", { room: room, players: players });
    });
  }
}
