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

export const inputCardStructures: IInputCardStructure[] = [
  {
    pointValue: 0,
    gemStoneValue: CardGemStone.DIAMOND,
    tier: CardTier.TIER1,
    requiredGemStones: [{ gemStone: GemStone.SAPPHIRE, required: 3 }],
  },
  {
    pointValue: 2,
    gemStoneValue: CardGemStone.EMERALD,
    tier: CardTier.TIER2,
    requiredGemStones:
      [{ gemStone: GemStone.DIAMOND, required: 4 },
      { gemStone: GemStone.SAPPHIRE, required: 2 },
      { gemStone: GemStone.CHOCOLATE, required: 2 }
      ],
  }
];
