"use strict"

import { User } from '../models/User'

export async function createNewUser(name: string): Promise<User> {
  if(!name || name.trim().length === 0) {
    throw new Error("User name cannot be empty");
  }
  return new User(name);
}
