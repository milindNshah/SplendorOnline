"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { Room } from './Room';
import { Board } from './Board';
import { InvalidGameError } from './Errors';
import { Player } from './Player';

const TARGET_SCORE = 15;

export interface GameEndTurn {
  playerID: string,
  gameID: string,
}

export class Game {
  id: string;
  board: Board;
  room: Room;
  targetScore: number;
  turnOrder: string[];
  curTurnIndex: number;
  gameTurn: number;
  winner: Player;
  tieBreakerMoreRounds: boolean;

  constructor (room: Room, board: Board, targetScore?: number) {
    this.id = this.createGameID();
    this.board = board;
    this.room = room;
    this.targetScore = targetScore ?? TARGET_SCORE;
    this.turnOrder = this.generateTurnOrder(Array.from(room.players.keys()))
    this.curTurnIndex = 0;
    this.gameTurn = 1;
    this.winner = null;
    this.tieBreakerMoreRounds = false;
  }

  createGameID(): string {
    return GlobalUtils.generateID();
  }

  generateTurnOrder(playerIDs: string[]): string[] {
    return GlobalUtils.shuffle(playerIDs);
  }

  checkValidTurn(playerID: string): boolean {
    if (playerID !== this.turnOrder[this.curTurnIndex]) {
      throw new InvalidGameError(`It is not player ${playerID}'s turn right now.`)
    }
    return true;
  }

  finishTurn(playerID: string): this {
    if (this.turnOrder[this.turnOrder.length - 1] === playerID) {
      this.checkScores();
      this.curTurnIndex = 0;
      this.gameTurn += 1;
    } else {
      this.curTurnIndex += 1;
    }
    return this;
  }

  private checkScores(): this {
    const players: Map<string, Player> = this.room.players;
    const playersWon = Array.from(players.values())
      .filter((player) => player.hand.score >= 15);

    if (playersWon.length < 1) {
      return this;
    }
    if (playersWon.length === 1) {
      this.winner = playersWon.pop();
      return this;
    }
    // Tie Breaker
    const highestScorePlayers: Player[]
      = this.checkHighestScoreOnTie(playersWon);
    if(highestScorePlayers.length === 1) {
      this.winner = highestScorePlayers.pop()
      return this;
    }
    const leastCardPlayers: Player[]
      = this.checkLeastCardsOnTie(highestScorePlayers)
    if(leastCardPlayers.length === 1) {
      this.winner = leastCardPlayers.pop()
      return this;
    }
    // Go more rounds until someone has more points or
    // breaks one of the other tie conditions
    // TODO: Implement more options that users can select
    this.tieBreakerMoreRounds = true;
    return this;
  }

  private checkHighestScoreOnTie(players: Player[]): Player[] {
    const maxScore: number = players
      .reduce((a, b) => a.hand.score > b.hand.score ? a : b)
      .hand.score;
    return players.filter(
      (player) => player.hand.score === maxScore
    );
  }

  private checkLeastCardsOnTie(players: Player[]): Player[] {
    const leastCards: number = players.reduce(
      (a, b) => a.hand.ownedCards.size < b.hand.ownedCards.size ? a : b
    ).hand.ownedCards.size;
    return players.filter(
      (player) => player.hand.ownedCards.size === leastCards
    );
  }
}
