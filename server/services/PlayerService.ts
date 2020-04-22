"use strict"

import { User } from '../models/User'
import * as UserService from '../services/UserService'
import { Player } from '../models/Player';

export function createNewPlayer(name: string, socketID: string, isHost?: boolean): Player {
  const user: User = UserService.createNewUser(name);
  const player: Player = new Player(socketID, user, isHost);
  return player;
}
