"use strict"

import { Noble } from "../models/Noble"
import { CardGemStone } from "../models/GemStone";
import { IInputNobleStructure, IInputRequiredCards, inputNobleStructures } from "../utils/NobleInputUtils";
import * as NobleService from "../services/NobleService";

const nobles: Map<string, Noble> = new Map();

export function generateAllNobles(): Map<string, Noble> {
  const nobleRequiredCards: Map<CardGemStone, number>[] =
    generateNobleRequiredCardsFromInputNobleStructures();
  nobleRequiredCards.forEach((nobleRequiredCard) => {
    const noble: Noble = NobleService.createNewNoble(nobleRequiredCard);
    nobles.set(noble.id, noble);
  })
  return nobles;
}

/* Helper Functions */
function generateNobleRequiredCardsFromInputNobleStructures(): Map<CardGemStone, number>[] {
  return inputNobleStructures.map((
    inputNobleStructure: IInputNobleStructure,
  ) => {
    return inputNobleStructure.requiredCards.reduce((
      map: Map<CardGemStone, number>,
      obj: IInputRequiredCards
    ) => {
      return map.set(obj.cardType, obj.required)
    }, new Map())
  })
}
