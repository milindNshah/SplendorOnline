"use strict";
import { serialize } from 'bson';
import { JoinRoomParams, LeaveRoomParams, ReadyRoomParams, Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import * as RoomService from '../services/RoomService'
import * as PlayerManager from '../PlayerManager'
import * as RoomManager from '../RoomManager'
import * as Socket from './Socket'
import * as ErrorHandler from './ErrorHandler';
import { InvalidInputError, UserServiceError } from './Errors';

export class SocketEvents {
  static initRoomEvents(socket: SocketIO.Socket): void {
    const io: SocketIO.Server = Socket.getIO();

    socket.on('createNewRoom', async function (userName: string) {
      try {
        const playerRoom: PlayerRoom = await RoomService.createNewRoom(userName.trim(), socket.id);
        const room: Room = playerRoom.room;
        const player: Player = playerRoom.player;

        socket.join(room.code);
        io.to(socket.id).emit("clientPlayerID", player.id);
        io.to(socket.id).emit("allowNavigateToRoom", { playerID: player.id, roomCode: room.code });
        io.sockets.in(room.code).emit("updateRoom", serialize(room));
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('joinRoom', async function (data: JoinRoomParams) {
      try {
        const playerRoom: PlayerRoom = await RoomService.joinRoom(
          data.roomCode,
          data.userName,
          socket.id,
        );
        const room: Room = playerRoom.room;
        const player: Player = playerRoom.player;

        socket.join(room.code);
        io.to(socket.id).emit("clientPlayerID", player.id);
        io.to(socket.id).emit("allowNavigateToRoom");
        io.sockets.in(room.code).emit("updateRoom", serialize(room));
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('playerReady', async function (data: ReadyRoomParams) {
      try {
        const room: Room = await RoomManager.getRoomByCode(data.roomCode);
        const player: Player = room.getPlayer(data.playerID);
        if (!player) {
          throw new InvalidInputError(`Player with ID: ${data.playerID} doesn't exist`);
        }
        player.toggleIsReady(data.isPlayerReady);
        io.sockets.in(room.code).emit("updateRoom", serialize(room));
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('startGame', async function (roomCode: string) {
      try {
        const room: Room = await RoomManager.getRoomByCode(roomCode);
        const canStartGame: boolean = room.canStartGame();
        if (!canStartGame) {
          throw new UserServiceError(`Cannot start game for room: ${room.code}`);
        }
        room.toggleGameStarted(true);
        io.sockets.in(room.code).emit("gameStarted");
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    })

    socket.on('disconnect', async function () {
      try {
        const player: Player = PlayerManager.getPlayerBySocketID(socket.id);
        // Possible if client didn't join/create a room.
        if (!player || player === null || player === undefined) {
          return;
        }

        const modifiedRooms: Room[] = await RoomManager.removePlayerFromRooms(player);
        modifiedRooms.forEach((room) => {
          io.sockets.in(room.code).emit("updateRoom", serialize(room));
        });
        await PlayerManager.removePlayer(player);
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('leftRoom', async function (data: LeaveRoomParams) {
      try {
        const room: Room = await RoomManager.getRoomByCode(data.roomCode);
        const player: Player = room.getPlayer(data.playerID);
        if (!player) {
          throw new InvalidInputError(`Cannot get playerID: ${data.playerID} from room: ${room.code}`);
        }

        await RoomManager.removePlayerFromRoom(room, player);
        socket.leave(room.code);
        io.sockets.in(room.code).emit("updateRoom", serialize(room));
        await PlayerManager.removePlayer(player);
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    })
  }
}
