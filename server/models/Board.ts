"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { CardTier, Card } from './Card';
import { GemStone } from './GemStone';
import * as CardManager from '../managers/CardManager';

export class Board {
  id: string;
  availableGemStones: Map<GemStone, number>;
  numPlayers: number;
  remainingTieredCards: Map<CardTier, Map<string, Card>>;
  activeTieredCards: Map<CardTier, Map<string, Card>>;

  constructor (numPlayers: number) {
    this.id = this.createBoardID();
    this.numPlayers = numPlayers;
    // TODO: Throw error if numPlayers > 4 or < 2
    this.setupBoard();
  }

  createBoardID(): string {
    return GlobalUtils.generateID();
  }

  setupBoard(): void {
    this.setupGemStones();
    this.setupCards();
    this.setupNobles();
  }

  setupCards(): void {
    this.remainingTieredCards = Object.keys(CardTier)
      .filter(key => isNaN(Number(key)))
      .map((key: string) => CardTier[key as keyof typeof CardTier])
      .reduce((map: Map<CardTier, Map<string, Card>>, cardTier: CardTier) => {
        return map.set(
          cardTier,
          CardManager.shuffleCards(new Map(CardManager.getCardsByTier(cardTier)))
        )
      }, new Map())
    // TODO: Check if right number of cards per Tier.
    // TODO: Create activeTieredCards after randomly shuffling in each tier above.
    const smth = Array.from(this.remainingTieredCards.keys())
      .map((tier: CardTier) => {
        // TODO: move from remaining to active.
      })
  }

  setupGemStones(): void {
    const numStones: number = this.numPlayers === 4
      ? 7 : this.numPlayers === 3
      ? 5 : 4;
    this.availableGemStones.set(GemStone.CHOCOLATE, numStones);
    this.availableGemStones.set(GemStone.DIAMOND, numStones);
    this.availableGemStones.set(GemStone.EMERALD, numStones);
    this.availableGemStones.set(GemStone.RUBY, numStones);
    this.availableGemStones.set(GemStone.SAPPHIRE, numStones);
    this.availableGemStones.set(GemStone.GOLD, 5);
  }

  setupNobles(): void {
    // TODO: Setup after cards.
  }


}
