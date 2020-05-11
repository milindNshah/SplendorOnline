"use strict";
import { serialize } from 'bson';
import { JoinRoomParams, LeaveRoomParams, ReadyRoomParams, Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import * as RoomService from '../services/RoomService'
import * as PlayerManager from '../managers/PlayerManager'
import * as RoomManager from '../managers/RoomManager'
import * as Socket from './Socket'
import * as ErrorHandler from './ErrorHandler';
import { InvalidInputError, UserServiceError, InvalidGameError } from '../models/Errors';
import { Game, GameEndTurn, ActionType } from '../models/Game';
import * as GameService from '../services/GameService'
import * as GameManager from '../managers/GameManager'
import * as CardManager from '../managers/CardManager';
import { Card } from '../models/Card';

export class SocketEvents {
  static initRoomEvents(socket: SocketIO.Socket): void {
    const io: SocketIO.Server = Socket.getIO();

    socket.on('CreateNewRoom', async function (userName: string) {
      try {
        const playerRoom: PlayerRoom = await RoomService.createNewRoom(userName, socket.id);
        const room: Room = playerRoom.room;
        const player: Player = playerRoom.player;

        socket.join(room.code);
        io.to(socket.id).emit("LoadWaitingRoom", { playerID: player.id, roomCode: room.code });
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('JoinRoom', async function (data: JoinRoomParams) {
      try {
        const playerRoom: PlayerRoom = await RoomService.joinRoom(
          data.roomCode,
          data.userName,
          socket.id,
        );
        const room: Room = playerRoom.room;
        const player: Player = playerRoom.player;

        socket.join(room.code);
        io.to(socket.id).emit("LoadWaitingRoom", { playerID: player.id, roomCode: room.code });
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('RequestRoomUpdate', async function (roomCode: string) {
      try {
        const room: Room = await RoomManager.getRoomByCode(roomCode);
        socket.join(room.code);
        io.sockets.in(room.code).emit("UpdateRoom", serialize(room));
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('PlayerReady', async function (data: ReadyRoomParams) {
      try {
        const room: Room = await RoomManager.getRoomByCode(data.roomCode);
        const player: Player = room.getPlayer(data.playerID);
        if (!player) {
          throw new InvalidInputError(`Player with ID: ${data.playerID} doesn't exist`);
        }
        player.toggleIsReady(data.isPlayerReady);
        io.sockets.in(room.code).emit("UpdateRoom", serialize(room));
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });

    socket.on('LeftRoom', async function (data: LeaveRoomParams) {
      console.log("leaving room");
      try {
        const room: Room = await RoomManager.getRoomByCode(data.roomCode);
        const player: Player = room.getPlayer(data.playerID);
        if (!player) {
          throw new InvalidInputError(`Cannot get playerID: ${data.playerID} from room: ${room.code}`);
        }

        await RoomManager.removePlayerFromRoom(room, player);
        socket.leave(room.code);
        io.sockets.in(room.code).emit("UpdateRoom", serialize(room));
        await PlayerManager.removePlayer(player);
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    })

    socket.on('StartNewGame', async function (roomCode: string) {
      try {
        const room: Room = await RoomManager.getRoomByCode(roomCode);
        const canStartGame: boolean = room.canStartGame();
        if (!canStartGame) {
          throw new UserServiceError(`Cannot start game for room: ${room.code}`);
        }
        const game: Game = await GameService.createNewGame(room);
        game.startTimer(io);
        io.sockets.in(room.code).emit("GameStarted", {
          gameID: game.id,
        });
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    })

    socket.on('RequestGameUpdate', async function (gameID: string) {
      try {
        const game: Game = await GameManager.getGameByID(gameID);
        io.to(socket.id).emit("UpdateGame", serialize(game));
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    })

    socket.on('EndTurn', async function(data: GameEndTurn){
      try {
        const actions: Map<string, any> = new Map(Object.entries(data.actions));
        if(!actions || actions.size > 1) {
          throw new InvalidGameError("Can't take more than one action per turn.")
        }
        const game: Game = await GameManager.getGameByID(data.gameID);
        const room: Room = game.room;
        const player: Player = room.getPlayer(data.playerID);
        await game.checkValidTurn(player.id);
        if(actions.has(ActionType.TAKE_GEMS)) {
          await game.transferGems(new Map(Object.entries(actions.get(ActionType.TAKE_GEMS))), player)
        }
        if(actions.has(ActionType.RESERVE_ACTIVE_CARD)) {
          const actionData = actions.get(ActionType.RESERVE_ACTIVE_CARD)
          const card: Card = CardManager.getCardByID(actionData.cardID);
          await game.reserveActiveCard(card, player, actionData.returnedToken);
        }
        if(actions.has(ActionType.RESERVE_DECK_CARD)) {
          const actionData = actions.get(ActionType.RESERVE_DECK_CARD)
          await game.reserveDeckCard(player, actionData.tier, actionData.returnedToken);
        }
        if(actions.has(ActionType.PURCHASE_ACTIVE_CARD)) {
          const card: Card = CardManager.getCardByID(actions.get(ActionType.PURCHASE_ACTIVE_CARD));
          await game.purchaseActiveCard(card, player);
        }
        if(actions.has(ActionType.PURCHASE_RESERVED_CARD)) {
          const card: Card = CardManager.getCardByID(actions.get(ActionType.PURCHASE_RESERVED_CARD));
          await game.purchaseReservedCard(card, player);
        }
        if(actions.has("hackForNobles")) {
          await game.hackForNobles(player);
        }
        game.finishTurn(player);
        if(!game.winner) {
          game.resetTimer(io);
        } else {
          game.stopTimer();
        }
        io.sockets.in(room.code).emit("UpdateGame", serialize(game))
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    })

    socket.on('LeftGame', async function (data: GameEndTurn) {
      try {
        const game: Game = await GameManager.getGameByID(data.gameID);
        const room: Room = game.room;
        const player: Player = room.getPlayer(data.playerID);
        if (!game || game === null || game === undefined
          || !player || player === null || player === undefined) {
            throw new InvalidGameError("Invalid game or player given")
        }
        game.handlePlayerLeftGame(player, io);
        await RoomManager.removePlayerFromRoom(room, player);
        socket.leave(room.code);
        io.sockets.in(room.code).emit("UpdateGame", serialize(game));
        await PlayerManager.removePlayer(player);
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id)
      }
    })

    socket.on('disconnect', async function () {
      try {
        const player: Player = PlayerManager.getPlayerBySocketID(socket.id);
        // Possible if client didn't join/create a room.
        if (!player || player === null || player === undefined) {
          return;
        }
        // TODO: Need to add extra functionality if player disconnects from game.
        const room: Room = RoomManager.getRoomByPlayer(player.id);
        if(room.gameID) {
          let game: Game = await GameManager.getGameByID(room.gameID);
          game.handlePlayerLeftGame(player, io)
        }
        await RoomManager.removePlayerFromRoom(room, player);
        socket.leave(room.code);
        io.sockets.in(room.code).emit("UpdateRoom", serialize(room));
        if(room.gameID) {
          let game: Game = await GameManager.getGameByID(room.gameID);
          io.sockets.in(room.code).emit("UpdateGame", serialize(game));
        }
        await PlayerManager.removePlayer(player);
      } catch (err) {
        await ErrorHandler.handleError(err, io, socket.id);
      }
    });
  }
}
