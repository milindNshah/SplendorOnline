"use strict";
import { JoinRoomParams, LeaveRoomParams, ReadyRoomParams, Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import * as RoomService from '../services/RoomService'
import * as PlayerManager from '../PlayerManager'
import * as RoomManager from '../RoomManager'
import { getIO } from './SocketUtils'

export class SocketEvents {
  static initRoomEvents(socket: SocketIO.Socket): void {
    const io: SocketIO.Server = getIO();

    socket.on('disconnect', function () {
      const player: Player = PlayerManager.getValidatedPlayerBySocketID(socket.id);
      // Possible if client didn't join/create a room.
      if (player === null) {
        return;
      }

      const modifiedRooms: Room[] = RoomManager.removePlayerFromRooms(player);
      modifiedRooms.forEach((room) => {
        io.sockets.in(room.code).emit("updateRoom", {
          room: room,
          players: Array.from(room.players.values())
        });
      });
      PlayerManager.removePlayer(player);
    });

    socket.on('leftRoom', function (data: LeaveRoomParams) {
      const room: Room = RoomManager.getValidatedRoomFromCode(data.roomCode);
      // if(!room) {
      //   throw new Error("invalid room code given somehow");
      // }
      const player: Player = room.getPlayer(data.playerID);
      // if(!player) {
      //   throw new Error("failed to get player somehow");
      // }

      RoomManager.removePlayerFromRoom(room, player);
      socket.leave(room.code);
      io.sockets.in(room.code).emit("updateRoom", {
        room: room,
        players: Array.from(room.players.values())
      })
      PlayerManager.removePlayer(player);
    })

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

    socket.on('playerReady', function (data: ReadyRoomParams) {
      const room: Room = RoomManager.getValidatedRoomFromCode(data.roomCode);
      // if(!room) {
      //   throw new Error("invalid room code given somehow");
      // }
      const player: Player = room.getPlayer(data.playerID);
      // if(!player) {
      //   throw new Error("failed to get player somehow");
      // }
      player.toggleIsReady(data.isPlayerReady);
      io.sockets.in(room.code).emit("updateRoom", {
        room: room,
        players: Array.from(room.players.values())
      })
    });
  }
}
