"use strict";

import { CardGemStone, GemStone } from "../models/GemStone";
import { CardTier } from "../models/Card";

export interface IInputCardStructure {
  pointValue: number,
  gemStoneType: CardGemStone,
  tier: CardTier,
  requiredGemStones: Array<IInputRequiredGemStones>,
}

export interface IInputRequiredGemStones {
  gemStone: GemStone,
  required: number,
}

export const inputCardStructures: IInputCardStructure[] = [
  {
    pointValue: 0,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 3 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.RUBY, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 4 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.EMERALD, required: 2 },
      { gemStone: GemStone.RUBY, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.EMERALD, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.RUBY, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 4 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.RUBY, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.EMERALD, required: 2 },
      { gemStone: GemStone.RUBY, required: 2 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.EMERALD, required: 3 },
      { gemStone: GemStone.RUBY, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.SAPPHIRE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 3 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.RUBY, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.RUBY, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.CHOCOLATE, required: 4 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.RUBY, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.RUBY, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.EMERALD, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.EMERALD, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.RUBY, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 4 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.RUBY, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 2 },
      { gemStone: GemStone.RUBY, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 3 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.RUBY, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.EMERALD, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 4 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.RUBY, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.RUBY, required: 1 },
    ],
  },
  {
    pointValue: 0,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER1,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.RUBY, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 5 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 6 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 3 },
      { gemStone: GemStone.RUBY, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 1 },
      { gemStone: GemStone.RUBY, required: 4 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.RUBY, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 5 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 5 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 6 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.EMERALD, required: 2 },
      { gemStone: GemStone.RUBY, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.RUBY, required: 1 },
      { gemStone: GemStone.CHOCOLATE, required: 4 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.EMERALD, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 5 },
      { gemStone: GemStone.SAPPHIRE, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 5 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 6 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.EMERALD, required: 2 },
      { gemStone: GemStone.RUBY, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 4 },
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 1 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 5 },
      { gemStone: GemStone.EMERALD, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.CHOCOLATE, required: 5 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 6 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 2 },
      { gemStone: GemStone.RUBY, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 1 },
      { gemStone: GemStone.SAPPHIRE, required: 4 },
      { gemStone: GemStone.EMERALD, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.RUBY, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 5 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 5 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.CHOCOLATE, required: 6 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.EMERALD, required: 2 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 1 },
      { gemStone: GemStone.EMERALD, required: 4 },
      { gemStone: GemStone.RUBY, required: 2 },
    ],
  },
  {
    pointValue: 1,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.EMERALD, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 2 },
    ],
  },
  {
    pointValue: 2,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER2,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 5 },
      { gemStone: GemStone.RUBY, required: 3 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.CHOCOLATE, required: 7 },
    ],
  },
  {
    pointValue: 5,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 7 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.RUBY, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 6 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.DIAMOND,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.EMERALD, required: 3 },
      { gemStone: GemStone.RUBY, required: 5 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 7 },
    ],
  },
  {
    pointValue: 5,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 7 },
      { gemStone: GemStone.SAPPHIRE, required: 3 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 6 },
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.SAPPHIRE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.EMERALD, required: 3 },
      { gemStone: GemStone.RUBY, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 5 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 7 },
    ],
  },
  {
    pointValue: 5,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 7 },
      { gemStone: GemStone.EMERALD, required: 3 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.SAPPHIRE, required: 6 },
      { gemStone: GemStone.EMERALD, required: 3 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.EMERALD,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 5 },
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.RUBY, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 7 },
    ],
  },
  {
    pointValue: 5,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 7 },
      { gemStone: GemStone.RUBY, required: 3 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.EMERALD, required: 6 },
      { gemStone: GemStone.RUBY, required: 3 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.RUBY,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.SAPPHIRE, required: 5 },
      { gemStone: GemStone.EMERALD, required: 3 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 7 },
    ],
  },
  {
    pointValue: 5,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.RUBY, required: 7 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 4,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.EMERALD, required: 3 },
      { gemStone: GemStone.RUBY, required: 6 },
      { gemStone: GemStone.CHOCOLATE, required: 3 },
    ],
  },
  {
    pointValue: 3,
    gemStoneType: CardGemStone.CHOCOLATE,
    tier: CardTier.TIER3,
    requiredGemStones: [
      { gemStone: GemStone.DIAMOND, required: 3 },
      { gemStone: GemStone.SAPPHIRE, required: 3 },
      { gemStone: GemStone.EMERALD, required: 5 },
      { gemStone: GemStone.RUBY, required: 3 },
    ],
  },
];
