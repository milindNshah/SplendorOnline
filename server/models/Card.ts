"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { GemStone, CardGemStone } from './GemStone'

/* TODO: This was converted to be of type string
* cause bson.serialize wouldn't accept number values.
* Maybe eventually create a toBSON or something that
* can accept it
*/
/* Should be kept in sync with cardtier.js on client */
export enum CardTier {
  TIER1 = '1',
  TIER2 = '2',
  TIER3 = '3',
}

export interface CardStructure {
  pointValue: number,
  gemStoneType: CardGemStone,
  tier: CardTier,
  requiredGemStones: Map<GemStone, number>,
}

export class Card {
  id: string;
  pointValue: number;
  gemStoneType: CardGemStone;
  tier: CardTier;
  requiredGemStones: Map<GemStone, number>;

  constructor (
    pointValue: number,
    gemStoneType: CardGemStone,
    tier: CardTier,
    requiredGemStones: Map<GemStone, number>
  ) {
    this.id = this.createCardID();
    this.pointValue = pointValue;
    this.gemStoneType = gemStoneType;
    this.tier = tier;
    this.requiredGemStones = requiredGemStones;
  }

  createCardID(): string {
    return GlobalUtils.generateID();
  }
}
