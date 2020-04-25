"use strict"

import { Noble } from "../models/Noble"
import { CardGemStone } from "../models/GemStone";
import { IInputNobleStructure, IInputRequiredCards, inputNobleStructures } from "../utils/NobleInputUtils";
import * as NobleService from "../services/NobleService";
import { NobleGenerationError } from "../models/Errors";

const nobles: Map<string, Noble> = new Map();

export function generateAllNobles(): Map<string, Noble> {
  const nobleRequiredCards: Map<CardGemStone, number>[] =
    generateNobleRequiredCardsFromInputNobleStructures();
  nobleRequiredCards.forEach((nobleRequiredCard) => {
    const noble: Noble = NobleService.createNewNoble(nobleRequiredCard);
    nobles.set(noble.id, noble);
  })
  if(nobles.size !== 10) {
    throw new NobleGenerationError("Generating the cards failed. There are too few");
  }
  return nobles;
}

export function getAllNobles(): Map<string, Noble> {
  return nobles;
}

// export function shuffleNobles(unshuffledNobles: Map<string, Noble>): Map<string, Noble> {
//   let nobleIDs = Array.from(unshuffledNobles.keys());
// }

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
