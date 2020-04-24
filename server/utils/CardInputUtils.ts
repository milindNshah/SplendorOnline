"use strict";

import { CardGemStone, GemStone } from "../models/GemStone";
import { CardTier } from "../models/Card";

export interface IInputCardStructure {
  pointValue: number,
  gemStoneValue: CardGemStone,
  tier: CardTier,
  requiredGemStones: Array<IInputRequiredGemStones>,
}

export interface IInputRequiredGemStones {
  gemStone: GemStone,
  required: number,
}

// TODO: Probably write a script converting the .xslx to this format.
export const inputCardStructures: IInputCardStructure[] = [
  {
    pointValue: 0,
    gemStoneValue: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 3 },
    ],
  },
  {
    pointValue: 0,
    gemStoneValue: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 1}
    ],
  },
  {
    pointValue: 1,
    gemStoneValue: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 4 },
    ],
  },
  {
    pointValue: 2,
    gemStoneValue: CardGemStone.EMERALD,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 4 },
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 3,
    gemStoneValue: CardGemStone.DIAMOND,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 6 },
    ],
  },
  {
    pointValue: 1,
    gemStoneValue: CardGemStone.RUBY,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.RUBY, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 5,
    gemStoneValue: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.RUBY, required: 7 },
    ],
  },
  {
    pointValue: 4,
    gemStoneValue: CardGemStone.RUBY,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.EMERALD, required: 6 },
      { gemStone: GemStone.RUBY, required: 1 },
    ],
  },
  {
    pointValue: 4,
    gemStoneValue: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 7 },
    ],
  },
];
