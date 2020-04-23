"use strict";
import { GlobalUtils } from '../utils/GlobalUtils';
import { Player } from './Player';

export interface JoinRoomParams {
  userName: string,
  roomCode: string,
}

export interface LeaveRoomParams {
  roomCode: string,
  playerID: string,
}

export interface ReadyRoomParams {
  roomCode: string,
  playerID: string,
  isPlayerReady: boolean,
}

export interface PlayerRoom {
  player: Player,
  room: Room,
}

export class Room {
  id: string;
  code: string;
  canStartGame: boolean;
  gameStarted: boolean;
  players: Map<string, Player>;

  constructor (host: Player) {
    this.id = this.createRoomID();
    this.canStartGame = false;
    this.code = this.createRoomCode();
    this.gameStarted = false;
    this.players = new Map();
    this.players.set(host.id, host);
  }

  createRoomID(): string {
    return GlobalUtils.generateID();
  }

  createRoomCode(): string {
    return GlobalUtils.generateAlphanumericID();
  }

  addPlayer(newPlayer: Player): this {
    if (!this.canJoinRoom()) {
      return;
      // TODO: shouldn't crash server, return error to client
      // throw new Error("Can't add more than 4 players to a room");
    }
    const nameExists = Array.from(this.players.values())
      .map((existingPlayer) => {
        return existingPlayer.user.name === newPlayer.user.name;
      }).reduce((acc, cur) => {
        return acc || cur;
      }, false)
    if (nameExists) {
      return;
      // throw new Error("Can't join a room with same name as another player");
    }

    this.players.set(newPlayer.id, newPlayer);
    this.modifyCanStartGame();
    return this;
  }

  hasPlayer(playerID: string): boolean {
    return this.players.has(playerID);
  }

  getPlayer(playerID: string): Player {
    return this.hasPlayer(playerID)
      ? this.players.get(playerID)
      : null;
  }

  makeNewHost(): this {
    if (this.players.size <= 0) {
      return this;
    }
    const newHost: Player = this.players.values().next().value;
    if(newHost !== null) {
      newHost.toggleIsHost(true);
      newHost.toggleIsReady(true);
    }
    return this;
  }

  removePlayer(playerID: string): this {
    if (this.hasPlayer(playerID)) {
      this.players.delete(playerID);
    }
    this.modifyCanStartGame();
    return this;
  }

  canJoinRoom(): boolean {
    let canStillJoin: boolean = true;
    if(this.players.size >= 4) {
      canStillJoin = false;
    }
    if(this.gameStarted) {
      canStillJoin = false;
    }
    return canStillJoin;
  }

  toggleGameStarted(startGame: boolean): this {
    this.gameStarted = startGame;
    return this;
  }

  modifyCanStartGame(): this {
    const allPlayersReady: boolean = Array.from(this.players.values())
      .map((player: Player) => {
        return player.isReady || player.isHost;
      }).reduce((acc: boolean, cur: boolean) => {
        return acc && cur;
      }, true);
    this.canStartGame = allPlayersReady && this.players.size >= 2 && this.players.size <= 4;
    return this;
  }
}
