"use strict"

import { GemStone } from "./GemStone";
import { Card } from "./Card";
import { Noble } from "./Noble";
import { GlobalUtils } from "../utils/GlobalUtils";

export class Hand {
  id: string;
  score: number;
  gemStones: Map<GemStone, number>;
  ownedCards: Map<string, Card>;
  reservedCards: Map<string, Card>;
  nobles: Map<string, Noble>
  turn: number;

  constructor () {
    this.id = this.createHandID();
    this.score = 0;
    this.gemStones = new Map();
    this.ownedCards = new Map();
    this.reservedCards = new Map();
    this.nobles = new Map();
    this.turn = 0;
  }

  createHandID(): string {
    return GlobalUtils.generateID();
  }

  // TODO: temp - remove after testing.
  addScore(value: number): this {
    this.score += value;
    return this;
  }
}
