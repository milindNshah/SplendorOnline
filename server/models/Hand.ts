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
  purchasedCards: Map<string, Card>;
  reservedCards: Map<string, Card>;
  nobles: Map<string, Noble>
  turn: number; /* TODO: I don't think this is actually accurate/correct */

  constructor () {
    this.id = this.createHandID();
    this.score = 0;
    this.gemStones = this.createGemStones();
    this.purchasedCards = new Map();
    this.reservedCards = new Map();
    this.nobles = new Map();
    this.turn = 0;
  }

  createHandID(): string {
    return GlobalUtils.generateID();
  }

  createGemStones(): Map<GemStone, number> {
    return new Map([
      [GemStone.DIAMOND, 0],
      [GemStone.SAPPHIRE, 0],
      [GemStone.EMERALD, 0],
      [GemStone.RUBY, 0],
      [GemStone.CHOCOLATE, 0],
      [GemStone.GOLD, 0],
    ])
  }

  incrementTurn(): this {
    this.turn += 1;
    return this;
  }

  canReserveCard(): boolean {
    return this.reservedCards.size < MAX_NUM_RESERVED_CARDS;
  }

  canPurchaseCard(card: Card): boolean {
    let goldLeft = this.gemStones.get(GemStone.GOLD);
    return Array.from(card.requiredGemStones.keys())
      .map((gemStone: GemStone) => {
        const have = this.gemStones.get(gemStone);
        const need = card.requiredGemStones.get(gemStone);
        if (have >= need) {
          return true;
        }
        if (goldLeft > 0 && have + goldLeft >= need) {
          goldLeft -= need - have;
          return true;
        }
        return false;
      }).reduce((prev, cur) => prev && cur)
  }

  async transferGems(gemsToTransfer: Map<GemStone, number>): Promise<this> {
    // The checks are being done in Board.transferGems.
    // This function shouldn't be used on its own.
    gemsToTransfer.forEach((amount: number, gemStone: GemStone) => {
      this.gemStones.set(gemStone, this.gemStones.get(gemStone)+amount);
    })
    return this;
  }

  async addToReserved(card: Card): Promise<this> {
    if (!this.canReserveCard()) {
      throw new InvalidGameError(`Can't reserve a card because you have already reserved 3 cards`);
    }
    this.reservedCards.set(card.id, card);
    return this;
  }

  async addToPurchased(gemStonesToRemove: Map<GemStone, number>, card: Card): Promise<this> {
    gemStonesToRemove.forEach((required: number, gemStone: GemStone) => {
      const have = this.gemStones.get(gemStone);
      if (have < required) {
        throw new InvalidGameError(`Can't purchase card: You Must Construct Additional Gems`);
      }
      this.gemStones.set(gemStone, have-required)
    })
    this.purchasedCards.set(card.id, card);
    return this;
  }

  async purchaseReservedCard(card: Card): Promise<this> {
    if(!this.reservedCards.has(card.id)) {
      throw new InvalidGameError(`Couldn't find the reserved card.`)
    }
    if (!this.canPurchaseCard(card)) {
      throw new InvalidGameError(`Can't purchase card: You Must Construct Additional Gems`);
    }
    this.reservedCards.delete(card.id);
    return this;
  }

  async updateScore(): Promise<this> {
    const score: number = Array.from(this.purchasedCards.values())
      .reduce((acc, card) => acc += card.pointValue, 0)
    this.score = score;
    return this;
  }

  takeGoldGemStone(): this {
    const numGoldGemStones = this.gemStones.get(GemStone.GOLD);
    this.gemStones.set(GemStone.GOLD, numGoldGemStones+1);
    return this;
  }
}
