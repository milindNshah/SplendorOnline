"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { GemStone, CardGemStone } from './GemStone'

export class Noble {
  id: string;
  pointValue: number;
  requiredCards: Map<CardGemStone, number>;

  constructor (
    pointValue: number,
    requiredCards: Map<CardGemStone, number>,
  ) {
    this.id = this.createNobleID();
    this.pointValue = pointValue;
    this.requiredCards = requiredCards;
  }

  createNobleID(): string {
    return GlobalUtils.generateID();
  }
}
