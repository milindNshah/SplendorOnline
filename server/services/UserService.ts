"use strict"

import { User } from '../models/User'

export function createNewUser(name: string, socketID: string, isHost?: boolean): User {
  return new User(name, socketID, isHost);
}
