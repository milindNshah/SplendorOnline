"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { GemStone, CardGemStone } from './GemStone'

export enum CardTier {
  TIER1 = 1,
  TIER2 = 2,
  TIER3 = 3,
}

export interface CardStructure {
  pointValue: number,
  gemStoneValue: CardGemStone,
  tier: CardTier,
  requiredGemStones: Map<GemStone, number>,
}

export class Card {
  id: string;
  pointValue: number;
  gemStoneValue: CardGemStone;
  tier: CardTier;
  requiredGemStones: Map<GemStone, number>;

  constructor (
    pointValue: number,
    gemStoneValue: CardGemStone,
    tier: CardTier,
    requiredGemStones: Map<GemStone, number>
  ) {
    this.id = this.createCardID();
    this.pointValue = pointValue;
    this.gemStoneValue = gemStoneValue;
    this.tier = tier;
    this.requiredGemStones = requiredGemStones;
  }

  createCardID(): string {
    return GlobalUtils.generateID();
  }
}
