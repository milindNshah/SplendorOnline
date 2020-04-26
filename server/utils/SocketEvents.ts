"use strict";
import { serialize } from 'bson';
import { JoinRoomParams, LeaveRoomParams, ReadyRoomParams, Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import * as RoomService from '../services/RoomService'
import * as PlayerManager from '../managers/PlayerManager'
import * as RoomManager from '../managers/RoomManager'
import * as Socket from './Socket'
import * as ErrorHandler from './ErrorHandler';
import { InvalidInputError, UserServiceError } from '../models/Errors';
import { Game, GameEndTurn } from '../models/Game';
import * as GameService from '../services/GameService'
import * as GameManager from '../managers/GameManager'

export class SocketEvents {
  static initRoomEvents(socket: SocketIO.Socket): void {
    const io: SocketIO.Server = Socket.getIO();

    socket.on('createNewRoom', async function (userName: string) {
      try {
        const playerRoom: PlayerRoom = await RoomService.createNewRoom(userName, socket.id);
        const room: Room = playerRoom.room;
        const player: Player = playerRoom.player;

        socket.join(room.code);
        io.to(socket.id).emit("allowNavigateToRoom", { playerID: player.id, roomCode: room.code });
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
        io.to(socket.id).emit("allowNavigateToRoom", { playerID: player.id, roomCode: room.code });
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('requestRoomUpdate', async function (roomCode: string) {
      try {
        const room: Room = await RoomManager.getRoomByCode(roomCode);
        socket.join(room.code);
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

    socket.on('startNewGame', async function (roomCode: string) {
      try {
        const room: Room = await RoomManager.getRoomByCode(roomCode);
        const canStartGame: boolean = room.canStartGame();
        if (!canStartGame) {
          throw new UserServiceError(`Cannot start game for room: ${room.code}`);
        }
        const game: Game = await GameService.createNewGame(room);
        io.sockets.in(room.code).emit("gameStarted", {
          gameID: game.id,
          targetScore: game.targetScore
        });
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    })

    socket.on('requestGameUpdate', async function (gameID: string) {
      try {
        const game: Game = await GameManager.getGameByID(gameID);
        io.to(socket.id).emit("updateGame", serialize(game));
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    })

    socket.on('endTurn', async function(data: GameEndTurn){
      try {
        const game: Game = await GameManager.getGameByID(data.gameID);
        const board = game.board;
        const room: Room = game.room;
        const player: Player = room.getPlayer(data.playerID);
        game.checkValidTurn(player.id);
        game.finishTurn(player.id);
        io.sockets.in(room.code).emit("updateGame", serialize(game))
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
  }
}
