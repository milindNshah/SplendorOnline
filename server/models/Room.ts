"use strict";
import { User } from '../models/User';
import * as UserService from '../UserService';
import { GlobalUtils } from '../globalUtils';
import * as RoomManager from '../RoomManager';

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

export class RoomService {
  static createNewRoom(userName: string, socketID: string): Room {
    const host: User = UserService.createNewUser(userName, socketID, true);
    const room: Room = new Room(host);
    RoomManager.addRoom(room);
    return room;
  }

  static joinRoom(userName: string, socketID: string, roomCode: string): Room {
    const user: User = UserService.createNewUser(userName, socketID, false);
    let room: Room = RoomManager.getRoomByCode(roomCode);
    // TODO: Deal with invalid room number.
    room = room.addPlayer(user);
    // TODO: Deal with player with already existing name in the same room.
    return room;
  }
}
