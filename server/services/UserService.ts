"use strict"

import { User } from '../models/User'
import { InvalidInputError } from '../utils/Errors';

export async function  createNewUser(name: string): Promise<User> {
  if (!name || name.trim().length === 0) {
    throw new InvalidInputError("User name cannot be empty");
  }
  return new User(name);
}
