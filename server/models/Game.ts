"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { Room } from './Room';
import { Board } from './Board';

const TARGET_SCORE = 15;

export class Game {
  id: string;
  board: Board;
  room: Room;
  targetScore: number;

  constructor(room: Room, board: Board, targetScore?: number) {
    this.id = this.createGameID();
    this.board = board;
    this.room = room;
    this.targetScore = targetScore ?? TARGET_SCORE;
  }

  createGameID(): string {
    return GlobalUtils.generateID();
  }
}
