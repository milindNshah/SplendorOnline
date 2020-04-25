"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { CardTier, Card } from './Card';
import { GemStone } from './GemStone';
import * as CardManager from '../managers/CardManager';
import { CardGenerationError } from './Errors';

const NUM_CARDS_PER_TIER = 4;

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

    if (this.remainingTieredCards.get(CardTier.TIER1).size !== 40) {
      throw new CardGenerationError(`Invalid number of cards generated for CardTier: ${CardTier.TIER1}`)
    }
    if (this.remainingTieredCards.get(CardTier.TIER2).size !== 30) {
      throw new CardGenerationError(`Invalid number of cards generated for CardTier: ${CardTier.TIER2}`)
    }
    if (this.remainingTieredCards.get(CardTier.TIER3).size !== 20) {
      throw new CardGenerationError(`Invalid number of cards generated for CardTier: ${CardTier.TIER3}`)
    }

    this.activeTieredCards = Array.from(this.remainingTieredCards.keys())
      .reduce((
        activeCards: Map<CardTier, Map<string, Card>>,
        tier: CardTier
      ) => {
        const remainingCardsForTier: Map<string, Card> = this.remainingTieredCards.get(tier);
        const activeCardsForTier = Array.from(remainingCardsForTier.keys())
          .slice(0, NUM_CARDS_PER_TIER)
          .reduce((
            map: Map<string, Card>,
            cardID: string,
          ) => {
            const card: Card = remainingCardsForTier.get(cardID);
            remainingCardsForTier.delete(cardID)
            return map.set(cardID, card);
          }, new Map());
        return activeCards.set(tier, activeCardsForTier);
      }, new Map())
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
