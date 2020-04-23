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

  private createUserID(): string {
    return GlobalUtils.generateID();
  }

  private changeName(name: string): this {
    this.name = name;
    return this;
  }

  private incrementGamesWon(): this {
    this.gamesWon += 1;
    return this;
  }
}
