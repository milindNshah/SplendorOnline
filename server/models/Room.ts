"use strict";
import { User } from '../models/User';
import { GlobalUtils } from '../utils/GlobalUtils';

export interface JoinRoomParams {
  userName: string,
  roomCode: string,
}

export class Room {
  host: User;
  players: User[];
  code: string;
  id: string;

  constructor(host: User) {
    this.host = host;
    this.players = [];
    this.players.push(host);
    this.id = this.createRoomID();
    this.code = this.createRoomCode();
  }

  createRoomID(): string {
    return GlobalUtils.generateID();
  }

  createRoomCode(): string {
    return GlobalUtils.generateID(2);
  }

  addPlayer(player: User): Room {
    this.players.push(player);
    return this;
  }
}
