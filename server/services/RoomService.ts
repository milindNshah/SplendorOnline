"use strict"

import { Room } from '../models/Room'
import { User } from '../models/User'
import * as UserService from '../services/UserService'
import * as RoomManager from '../RoomManager'

export function createNewRoom(userName: string, socketID: string): Room {
  const host: User = UserService.createNewUser(userName, socketID, true);
  const room: Room = new Room(host);
  RoomManager.addRoom(room);
  return room;
}

export function joinRoom(userName: string, socketID: string, roomCode: string): Room {
  const user: User = UserService.createNewUser(userName, socketID, false);
  let room: Room = RoomManager.getRoomByCode(roomCode);
  // TODO: Deal with invalid room number.
  room = room.addPlayer(user);
  // TODO: Deal with player with already existing name in the same room.
  return room;
}
