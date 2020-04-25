"use strict"

import { CardGemStone } from "../models/GemStone";

export interface IInputNobleStructure {
  requiredCards: Array<IInputRequiredCards>
}

export interface IInputRequiredCards {
  cardType: CardGemStone,
  required: number,
}

export const inputNobleStructures: IInputNobleStructure[] = [
  {
    requiredCards: [
      { cardType: CardGemStone.DIAMOND, required: 3 },
      { cardType: CardGemStone.SAPPHIRE, required: 3 },
      { cardType: CardGemStone.CHOCOLATE, required: 3 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.SAPPHIRE, required: 3 },
      { cardType: CardGemStone.EMERALD, required: 3 },
      { cardType: CardGemStone.RUBY, required: 3 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.DIAMOND, required: 3 },
      { cardType: CardGemStone.RUBY, required: 3 },
      { cardType: CardGemStone.CHOCOLATE, required: 3 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.EMERALD, required: 4 },
      { cardType: CardGemStone.RUBY, required: 4 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.SAPPHIRE, required: 4 },
      { cardType: CardGemStone.EMERALD, required: 4 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.RUBY, required: 4 },
      { cardType: CardGemStone.CHOCOLATE, required: 4 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.DIAMOND, required: 4 },
      { cardType: CardGemStone.CHOCOLATE, required: 4 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.DIAMOND, required: 3 },
      { cardType: CardGemStone.SAPPHIRE, required: 3 },
      { cardType: CardGemStone.EMERALD, required: 3 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.EMERALD, required: 3 },
      { cardType: CardGemStone.RUBY, required: 3 },
      { cardType: CardGemStone.CHOCOLATE, required: 3 },
    ]
  },
  {
    requiredCards: [
      { cardType: CardGemStone.DIAMOND, required: 4 },
      { cardType: CardGemStone.SAPPHIRE, required: 4 },
    ]
  },
];
