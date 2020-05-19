"use strict"
import { Room, PlayerRoom } from '../models/Room'
import { Player } from '../models/Player'
import { User } from '../models/User'
import * as UserService from '../services/UserService'
import * as PlayerService from '../services/PlayerService'
import * as RoomManager from '../managers/RoomManager'
import * as PlayerManager from '../managers/PlayerManager'
import { InvalidGameError } from '../models/Errors'

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
    let player: Player = null;
    let joinedExisting = false;

    const gameHasOpenSpots: number =
    Array.from(room.players.values())
    .reduce((numSpots: number, player: Player) => {
      return numSpots += player.isConnected ? 0 : 1;
    }, 0)
    if(gameHasOpenSpots) {
      if(!room.gameStarted || !room.gameID){
        throw new InvalidGameError(`Game hasn't started yet but has open spots. This shouldn't happen.`)
      }
      const user: User = await UserService.createNewUser(userName);
      player = await room.reconnectUser(user, socketID)
      PlayerManager.addPlayer(player)
      joinedExisting = true;
    } else {
      player = await PlayerService.createNewPlayer(userName, socketID, false);
      await room.addPlayer(player);
    }
    return { player: player, room: room, joinedExisting: joinedExisting };
  } catch (err) {
    throw err
  }
}
