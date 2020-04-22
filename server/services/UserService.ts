"use strict"

import { User } from '../models/User'

export function createNewUser(name: string): User {
  return new User(name);
}
