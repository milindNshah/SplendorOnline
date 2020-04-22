"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'

export class User {
  id: string;
  name: string;
  gamesWon: number;

  constructor (name: string) {
    this.id = this.createUserID();
    this.name = name;
    this.gamesWon = 0;
  }

  createUserID(): string {
    return GlobalUtils.generateID();
  }

  changeName(name: string): this {
    this.name = name;
    return this;
  }

  incrementGamesWon(): this {
    this.gamesWon += 1;
    return this;
  }
}
