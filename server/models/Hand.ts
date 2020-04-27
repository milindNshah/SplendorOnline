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
  turn: number;

  constructor () {
    this.id = this.createHandID();
    this.score = 0;
    this.gemStones = new Map();
    this.purchasedCards = new Map();
    this.reservedCards = new Map();
    this.nobles = new Map();
    this.turn = 0;
  }

  createHandID(): string {
    return GlobalUtils.generateID();
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
      this.gemStones.set(gemStone, amount);
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

  async addToActive(card: Card): Promise<this> {
    if (!this.canPurchaseCard(card)) {
      throw new InvalidGameError(`Can't purchase card: You Must Construct Additional Gems`);
    }
    card.requiredGemStones.forEach((required: number, gemStone: GemStone) => {
      const have = this.gemStones.get(gemStone);
      const goldLeft = this.gemStones.get(GemStone.GOLD);
      if(have >= required) {
        this.gemStones.set(gemStone, have-required);
      } else if (have + goldLeft >= required) {
        this.gemStones.set(gemStone, 0);
        this.gemStones.set(GemStone.GOLD, goldLeft-(required-have));
      } else {
        throw new InvalidGameError(`Can't purchase card: You Must Construct Additional Gems`);
      }
    })
    this.purchasedCards.set(card.id, card);
    return this;
  }

  takeGoldGemStone(): this {
    const numGoldGemStones = this.gemStones.get(GemStone.GOLD);
    this.gemStones.set(GemStone.GOLD, numGoldGemStones+1);
    return this;
  }
}
