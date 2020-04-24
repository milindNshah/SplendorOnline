"use strict"

import { Card, CardStructure } from "../models/Card"
import * as CardService from "../services/CardService"
import { GemStone } from "../models/GemStone";
import { IInputCardStructure, IInputRequiredGemStones, inputCardStructures } from "../utils/CardInputUtils";

const cards: Map<string, Card> = new Map();

export function generateAllCards(): Map<string, Card> {
  const generatedCardStructures: CardStructure[] = generateCardStructuresFromInputCardStructures();
  generatedCardStructures.map((generatedCardStructure: CardStructure) =>{
    const card: Card = CardService.createNewCard(generatedCardStructure);
    cards.set(card.id, card);
  })
  console.log(cards);
  return;
}

export function getAllCards(): Map<string, Card> {
  return cards;
}

/* Helper functions */
function generateCardStructuresFromInputCardStructures(): CardStructure[] {
  return inputCardStructures.map((inputCardStructure: IInputCardStructure) => {
    let requiredGemStoneMap: Map<GemStone, number> = new Map();
    inputCardStructure.requiredGemStones.forEach((gemStoneArr: IInputRequiredGemStones) => {
      requiredGemStoneMap.set(gemStoneArr.gemStone, gemStoneArr.required)
    });

    return {
      pointValue: inputCardStructure.pointValue,
      gemStoneValue: inputCardStructure.gemStoneValue,
      tier: inputCardStructure.tier,
      requiredGemStones: requiredGemStoneMap,
    }
  })
}
