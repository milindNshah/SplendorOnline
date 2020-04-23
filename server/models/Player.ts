"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { User } from './User';

export class Player {
  id: string;
  isHost: boolean;
  isReady: boolean;
  socketID: string;
  user: User;

  constructor (socketID: string, user: User, isHost?: boolean) {
    this.id = this.createPlayerID();
    this.isHost = isHost ?? false;
    this.isReady = isHost ?? false;
    this.socketID = socketID;
    this.user = user;
  }

  createPlayerID(): string {
    return GlobalUtils.generateID();
  }

  changeUser(user: User): this {
    this.user = user;
    return this;
  }

  toggleIsReady(isReady: boolean): this {
    this.isReady = isReady;
    return this;
  }

  toggleIsHost(isHost: boolean): this {
    this.isHost = isHost;
    return this;
  }
}
