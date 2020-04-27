"use strict"

import { GemStone } from "./GemStone";
import { Card } from "./Card";
import { Noble } from "./Noble";
import { GlobalUtils } from "../utils/GlobalUtils";
import { InvalidGameError } from "./Errors";

const MAX_NUM_RESERVED_CARDS = 3;

export class Hand {
  id: string;
  score: number;
  gemStones: Map<GemStone, number>;
  ownedCards: Map<string, Card>;
  reservedCards: Map<string, Card>;
  nobles: Map<string, Noble>
  turn: number;

  constructor () {
    this.id = this.createHandID();
    this.score = 0;
    this.gemStones = new Map();
    this.ownedCards = new Map();
    this.reservedCards = new Map();
    this.nobles = new Map();
    this.turn = 0;
  }

  createHandID(): string {
    return GlobalUtils.generateID();
  }

  // TODO: temp - remove after testing.
  addScore(value: number): this {
    this.score += value;
    return this;
  }

  incrementTurn(): this {
    this.turn += 1;
    return this;
  }

  canReserveCard(): boolean {
    return this.reservedCards.size < MAX_NUM_RESERVED_CARDS;
  }

  async transferGems(gemsToTransfer: Map<GemStone, number>): Promise<this> {
    // The checks are being done in Board.transferGems.
    // This function shouldn't be used on its own.
    gemsToTransfer.forEach((amount: number, gemStone: GemStone) => {
      this.gemStones.set(gemStone, amount);
    })
    return this;
  }

  async addToReserved(card: Card): Promise<this> {
    if(!this.canReserveCard()) {
      throw new InvalidGameError(`Can't reserve a card because you have already reserved 3 cards`);
    }
    this.reservedCards.set(card.id, card);
    return this;
  }
}
