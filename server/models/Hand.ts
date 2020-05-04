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
    const purchasedCards: Map<GemStone, Card[]> = this.getPurchasedCardsByTypes();
    let goldLeft = this.gemStones.get(GemStone.GOLD);
    return Array.from(card.requiredGemStones.keys())
      .map((gemStone: GemStone) => {
        const have: number = this.gemStones.get(gemStone);
        const need: number = card.requiredGemStones.get(gemStone);
        const purchased: number = purchasedCards.get(gemStone)
        ? purchasedCards.get(gemStone).length
        : 0;
        if (have + purchased >= need) {
          return true;
        } else if (goldLeft > 0 && have + purchased + goldLeft >= need) {
          goldLeft -= need - (have + purchased);
          return true;
        }
        return false;
      }).reduce((prev, cur) => prev && cur)
  }

  getPurchasedCardsByTypes(): Map<GemStone, Card[]> {
    return Array.from(this.purchasedCards.keys())
    .reduce((map: Map<GemStone, Card[]>, key: string) => {
      const card: Card = this.purchasedCards.get(key)
      const gemStone: GemStone = GemStone[card.gemStoneType.toString().toUpperCase() as keyof typeof GemStone];  // ew
      let cardsForType: Card[];
      if(map.has(gemStone)) {
        cardsForType = map.get(gemStone)
        cardsForType.push(card)
      } else {
        cardsForType = [];
        cardsForType.push(card);
      }
      return map.set(gemStone, cardsForType)
    }, new Map())
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

  async addToNobles(nobles: Noble[]): Promise<this> {
    nobles.forEach((noble: Noble) => {
      this.nobles.set(noble.id, noble);
    })
    return this;
  }

  async updateScore(): Promise<this> {
    const cardScore: number = Array.from(this.purchasedCards.values())
      .reduce((acc, card) => acc += card.pointValue, 0)
    const nobleScore: number = Array.from(this.nobles.values())
      .reduce((acc, noble) => acc += noble.pointValue, 0)
    this.score = cardScore + nobleScore;
    return this;
  }

  takeGoldGemStone(): this {
    const numGoldGemStones = this.gemStones.get(GemStone.GOLD);
    this.gemStones.set(GemStone.GOLD, numGoldGemStones+1);
    return this;
  }
}
