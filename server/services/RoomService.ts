"use strict"
import { Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import * as PlayerService from '../services/PlayerService'
import * as RoomManager from '../RoomManager'

export function createNewRoom(userName: string, socketID: string): PlayerRoom {
  const host: Player = PlayerService.createNewPlayer(userName, socketID, true);
  const room: Room = new Room(host);
  RoomManager.addRoom(room);
  return { player: host, room: room };
}

export function joinRoom(userName: string, socketID: string, roomCode: string): PlayerRoom {
  const player: Player = PlayerService.createNewPlayer(userName, socketID, false);
  const room = RoomManager.getValidatedRoomFromCode(roomCode);
  room.addPlayer(player);
  return { player: player, room: room };
}
