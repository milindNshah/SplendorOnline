"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { User } from './User';
import { Hand } from './Hand';

export class Player {
  id: string;
  isHost: boolean;
  isReady: boolean;
  socketID: string;
  user: User;
  hand: Hand;
  isConnected: boolean;

  constructor (socketID: string, user: User, isHost?: boolean) {
    this.id = this.createPlayerID();
    this.isHost = isHost ?? false;
    this.isReady = isHost ?? false;
    this.socketID = socketID;
    this.user = user;
    this.hand = null;
    this.isConnected = true;
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

  setHand(hand: Hand): this {
    this.hand = hand;
    return this;
  }

  setDisconnected(): this {
    this.isConnected = false;
    this.isHost = false;
    return this;
  }

  reconnect(newUser: User, socketID: string): this {
    this.isHost = false;
    this.isReady = true;
    this.socketID = socketID;
    this.user = newUser;
    this.isConnected = true;
    return this;
  }
}
