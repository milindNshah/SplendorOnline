"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { Room } from './Room';

const TARGET_SCORE = 15;

export class Game {
  id: string;
  room: Room;
  targetScore: number;

  constructor(room: Room, targetScore?: number) {
    this.id = this.createGameID();
    this.room = room;
    this.targetScore = targetScore ?? TARGET_SCORE;
  }

  createGameID(): string {
    return GlobalUtils.generateID();
  }
}
