"use strict";
import { GlobalUtils } from '../utils/GlobalUtils';
import { Player } from './Player';
import { UserServiceError } from './Errors';

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
  gameStarted: boolean;
  players: Map<string, Player>;

  constructor (host: Player) {
    this.id = this.createRoomID();
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

  async addPlayer(newPlayer: Player): Promise<this> {
    if (this.gameStarted) {
      throw new UserServiceError(`Game has already started for Room:.`);
    }

    if (!this.canAddPlayer()) {
      throw new UserServiceError(`Room ${this.code} is full (${this.players.size}/4.)`);
    }

    const nameExists = Array.from(this.players.values())
      .map((existingPlayer) => {
        return existingPlayer.user.name === newPlayer.user.name;
      }).reduce((acc, cur) => {
        return acc || cur;
      }, false)
    if (nameExists) {
      throw new UserServiceError(`Can't join a room with same name: "${newPlayer.user.name}" as another player`);
    }

    this.players.set(newPlayer.id, newPlayer);
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

  async makeNewHost(): Promise<this> {
    if (this.players.size <= 0) {
      return this;
    }
    const newHost: Player = this.players.values().next().value;
    if (newHost && newHost !== null && newHost !== undefined) {
      newHost.toggleIsHost(true);
      newHost.toggleIsReady(true);
    }
    return this;
  }

  async removePlayer(playerID: string): Promise<this> {
    if (this.hasPlayer(playerID)) {
      this.players.delete(playerID);
    }
    return this;
  }

  canAddPlayer(): boolean {
    return this.players.size < 4;
  }

  toggleGameStarted(startGame: boolean): this {
    this.gameStarted = startGame;
    return this;
  }

  // Keep in sync with RoomComponent.jsx->canStartGame() on Client.
  canStartGame(): boolean {
    const allPlayersReady: boolean = Array.from(this.players.values())
      .map((player: Player) => {
        return player.isReady || player.isHost;
      }).reduce((acc: boolean, cur: boolean) => {
        return acc && cur;
      }, true);
    return allPlayersReady && this.players.size >= 2 && this.players.size <= 4;
  }
}
