"use strict";
import { JoinRoomParams, LeaveRoomParams, ReadyRoomParams, Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import * as RoomService from '../services/RoomService'
import * as PlayerManager from '../PlayerManager'
import * as RoomManager from '../RoomManager'
import { getIO } from './SocketUtils'
import { serialize } from 'bson';

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
        io.sockets.in(room.code).emit("updateRoom", serialize(room));
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
      io.sockets.in(room.code).emit("updateRoom", serialize(room));
      PlayerManager.removePlayer(player);
    })

    socket.on('createNewRoom', function (userName: string) {
      const playerRoom: PlayerRoom = RoomService.createNewRoom(userName, socket.id);
      const room: Room = playerRoom.room;
      const player: Player = playerRoom.player;
      socket.join(room.code);
      io.to(socket.id).emit("clientPlayerID", player.id);

      io.sockets.in(room.code).emit("updateRoom", serialize(room));
    });

    socket.on('joinRoom', function (data: JoinRoomParams) {
      const playerRoom: PlayerRoom = RoomService.joinRoom(
        data.userName,
        socket.id,
        data.roomCode
      );
      if(playerRoom === null) {
        return;
        // TODO: Should pass error to client
      }
      const room: Room = playerRoom.room;
      const player: Player = playerRoom.player;
      socket.join(room.code);
      io.to(socket.id).emit("clientPlayerID", player.id);

      io.sockets.in(room.code).emit("updateRoom", serialize(room));
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
      room.modifyCanStartGame();
      io.sockets.in(room.code).emit("updateRoom", serialize(room));
    });

    socket.on('startGame', function(roomCode: string) {
      const room: Room = RoomManager.getValidatedRoomFromCode(roomCode);
      // if(!room) {
      //   throw new Error("invalid room code given somehow");
      // }
      const canStartGame: boolean = room.canStartGame;
      if(!canStartGame) {
        // throw new Error to client...
        return;
      }
      room.toggleGameStarted(true);
      io.sockets.in(room.code).emit("gameStarted");
    })
  }
}
