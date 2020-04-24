"use strict"
import { Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import * as PlayerService from '../services/PlayerService'
import * as RoomManager from '../managers/RoomManager'

export async function createNewRoom(userName: string, socketID: string): Promise<PlayerRoom> {
  try {
    const host: Player = await PlayerService.createNewPlayer(userName, socketID, true);
    const room: Room = new Room(host);
    RoomManager.addRoom(room);
    return { player: host, room: room };
  } catch (err) {
    throw err
  }
}

export async function joinRoom(roomCode: string, userName: string, socketID: string): Promise<PlayerRoom> {
  try {
    const room = await RoomManager.getRoomByCode(roomCode);
    const player: Player = await PlayerService.createNewPlayer(userName, socketID, false);
    await room.addPlayer(player);
    return { player: player, room: room };
  } catch (err) {
    throw err
  }
}
