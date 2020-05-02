"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { CardTier, Card } from './Card';
import { GemStone } from './GemStone';
import * as CardManager from '../managers/CardManager';
import * as NobleManager from '../managers/NobleManager';
import { CardGenerationError, InvalidGameError } from './Errors';
import { Noble } from './Noble';
import * as CardService from '../services/CardService';
import * as NobleService from '../services/NobleService';

const NUM_CARDS_PER_TIER = 4;
const NUM_GEM_STONES_TWO_PLAYER = 4;
const NUM_GEM_STONES_THREE_PLAYER = 5;
const NUM_GEM_STONES_FOUR_PLAYER = 7;
const NUM_GEM_STONE_PREVENTING_TAKING_TWO = 4;

export class Board {
  id: string;
  availableGemStones: Map<GemStone, number>;
  numPlayers: number;
  remainingTieredCards: Map<CardTier, Map<string, Card>>;
  activeTieredCards: Map<CardTier, Map<string, Card>>;
  activeNobles: Map<string, Noble>;

  constructor (numPlayers: number) {
    this.id = this.createBoardID();
    this.availableGemStones = new Map();
    this.numPlayers = numPlayers;
    this.remainingTieredCards = new Map();
    this.activeTieredCards = new Map();
    this.activeNobles = new Map();
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

  setupGemStones(): void {
    const numStones: number = this.numPlayers === 4
      ? NUM_GEM_STONES_FOUR_PLAYER : this.numPlayers === 3
        ? NUM_GEM_STONES_THREE_PLAYER : NUM_GEM_STONES_TWO_PLAYER;
    this.availableGemStones.set(GemStone.DIAMOND, numStones);
    this.availableGemStones.set(GemStone.SAPPHIRE, numStones);
    this.availableGemStones.set(GemStone.EMERALD, numStones);
    this.availableGemStones.set(GemStone.RUBY, numStones);
    this.availableGemStones.set(GemStone.CHOCOLATE, numStones);
    this.availableGemStones.set(GemStone.GOLD, 5);
  }

  setupCards(): void {
    this.remainingTieredCards = Object.keys(CardTier)
      .filter(key => isNaN(Number(key)))
      .map((key: string) => CardTier[key as keyof typeof CardTier])
      .reduce((map: Map<CardTier, Map<string, Card>>, cardTier: CardTier) => {
        return map.set(
          cardTier,
          CardService.shuffleCards(new Map(CardManager.getCardsByTier(cardTier)))
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

  setupNobles(): void {
    const numNobles: number = this.numPlayers + 1;
    const nobles = NobleService.shuffleNobles(new Map(NobleManager.getAllNobles()));
    this.activeNobles = Array.from(nobles.keys())
      .slice(0, numNobles)
      .reduce((
        activeNobles: Map<string, Noble>,
        nobleID: string,
      ) => {
        const noble: Noble = nobles.get(nobleID);
        nobles.delete(nobleID);
        return activeNobles.set(nobleID, noble);
      }, new Map())
  }

  async transferGems(gemsToTransfer: Map<GemStone, number>): Promise<void> {
    let hasTakenAnyGemstones: boolean = false;
    let hasTakenTwoGemstones: boolean = false;

    gemsToTransfer.forEach((amount: number, gemStone: GemStone) => {
      const availableGemStone = this.availableGemStones.get(gemStone);
      if (amount === 0) {
        return;
      }
      if (amount > 2) {
        throw new InvalidGameError(`You may not take more than 2 gemstones of the same type`)
      }
      if (amount > availableGemStone) {
        throw new InvalidGameError(`You may not take ${amount} ${gemStone} gemstone(s). There are ${availableGemStone} ${gemStone} gemstone(s) available.`)
      }
      if (amount === 2 && hasTakenAnyGemstones) {
        throw new InvalidGameError(`You may only take two gemstones of a single gemstone type and no other gemstone`);
      }
      if (amount === 2 && availableGemStone < NUM_GEM_STONE_PREVENTING_TAKING_TWO) {
        throw new InvalidGameError(`You may not take more than 1 gemstone of type ${gemStone} because there are less than ${NUM_GEM_STONE_PREVENTING_TAKING_TWO} ${gemStone} gemstones available.`)
      }
      if (amount === 2) {
        hasTakenAnyGemstones = true;
        hasTakenTwoGemstones = true;
        this.availableGemStones.set(gemStone, availableGemStone - amount)
      }
      if (amount === 1 && hasTakenTwoGemstones) {
        throw new InvalidGameError(`You may only take two gemstones of a single gemstone type and no other gemstone`);
      }
      if (amount === 1) {
        hasTakenAnyGemstones = true;
        this.availableGemStones.set(gemStone, availableGemStone - amount)
      }
      if (amount < 0) {
        this.availableGemStones.set(gemStone, availableGemStone - amount)
      }
    });
  }

  async swapActiveCard(card: Card): Promise<this> {
    const activeCardTier: Map<string, Card> =
      this.activeTieredCards.get(card.tier);
    if (activeCardTier.has(card.id)) {
      activeCardTier.delete(card.id);
      this.addNewActiveCard(card.tier);
    } else {
      throw new InvalidGameError(`Invalid card given. Unable to get card`)
    }
    return this;
  }

  async reserveDeckCard(tier: CardTier): Promise<Card> {
    const remainingCardTier: Map<string, Card> =
      this.remainingTieredCards.get(tier);
    if (remainingCardTier.size === 0) {
      throw new InvalidGameError(`No more cards of tier ${tier} remaining`);
    }
    const cardToTake: Card = Array.from(remainingCardTier.values()).pop();
    remainingCardTier.delete(cardToTake.id);
    return cardToTake;
  }

  async removeGoldGemStone(): Promise<boolean> {
    const numGoldGemStones = this.availableGemStones.get(GemStone.GOLD);
    if(numGoldGemStones > 0) {
      this.availableGemStones.set(GemStone.GOLD, numGoldGemStones-1)
      return true;
    } else {
      throw new InvalidGameError(`No more gold tokens left. Card was reserved`);
    }
  }

  private addNewActiveCard(tier: CardTier): this {
    const activeCardTier: Map<string, Card> =
      this.activeTieredCards.get(tier);
    const remainingCardTier: Map<string, Card> =
      this.remainingTieredCards.get(tier);

    const cardToMove: Card = Array.from(remainingCardTier.values()).pop();
    if (!cardToMove || cardToMove === null || cardToMove === undefined) {
      return; // No more remaining cards in this tier
    }
    remainingCardTier.delete(cardToMove.id);
    activeCardTier.set(cardToMove.id, cardToMove);
    return this;
  }
}
