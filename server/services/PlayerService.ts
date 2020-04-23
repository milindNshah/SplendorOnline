"use strict"

import { User } from '../models/User'
import * as UserService from '../services/UserService'
import { Player } from '../models/Player'
import * as PlayerManger from '../PlayerManager'

export async function createNewPlayer(name: string, socketID: string, isHost?: boolean): Promise<Player> {
  try {
    const user: User = await UserService.createNewUser(name);
    const player: Player = new Player(socketID, user, isHost);
    PlayerManger.addPlayer(player);
    return player;
  } catch (err) {
    throw err;
  }
}
