"use strict";
import { GlobalUtils } from '../utils/GlobalUtils';
import { Player } from './Player';

export interface JoinRoomParams {
  userName: string,
  roomCode: string,
}

export interface PlayerRoom {
  player: Player,
  room: Room,
}

export class Room {
  id: string;
  code: string;
  host: Player;
  players: Map<string, Player>;

  constructor (host: Player) {
    this.id = this.createRoomID();
    this.code = this.createRoomCode();
    this.host = host;
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
    if(this.players.size >= 4) {
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
      // throw new Error("Can't join a room with same name as another player");
    }

    this.players.set(newPlayer.id, newPlayer);
    return this;
  }

  hasPlayer(playerID: string): boolean {
    return this.players.has(playerID);
  }

  removePlayer(playerID: string): this {
    if(this.hasPlayer(playerID)) {
      this.players.delete(playerID);
    }
    return this;
  }
}
