"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { CardGemStone } from './GemStone'

const NOBLE_POINT_VALUE = 3;

export class Noble {
  id: string;
  pointValue: number;
  requiredCards: Map<CardGemStone, number>;

  constructor (
    requiredCards: Map<CardGemStone, number>,
  ) {
    this.id = this.createNobleID();
    this.pointValue = NOBLE_POINT_VALUE;
    this.requiredCards = requiredCards;
  }

  createNobleID(): string {
    return GlobalUtils.generateID();
  }
}
