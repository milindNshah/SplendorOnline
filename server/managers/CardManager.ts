"use strict"

import { Card, CardStructure, CardTier } from "../models/Card"
import * as CardService from "../services/CardService"
import { GemStone } from "../models/GemStone";
import { IInputCardStructure, IInputRequiredGemStones, inputCardStructures } from "../utils/CardInputUtils";
import { CardGenerationError } from "../models/Errors";

const cards: Map<string, Card> = new Map();

export function generateAllCards(): Map<string, Card> {
  const generatedCardStructures: CardStructure[] = generateCardStructuresFromInputCardStructures();
  generatedCardStructures.forEach((generatedCardStructure: CardStructure) => {
    const card: Card = CardService.createNewCard(generatedCardStructure);
    cards.set(card.id, card);
  })
  if(cards.size !== 90) {
    throw new CardGenerationError("Generating the cards failed. There are too few");
  }
  return cards;
}

export function getAllCards(): Map<string, Card> {
  return cards;
}

export function getCardsByTier(tier: CardTier): Map<string, Card> {
  return Array.from(cards.values())
    .filter((card: Card) => {
      return card.tier === tier
    }).reduce(function (tier1Cards: Map<string, Card>, card: Card) {
      return tier1Cards.set(card.id, card);
    }, new Map());
}

export function shuffleCards(unshuffledCards: Map<string, Card>): Map<string, Card> {
  let cardIDs = Array.from(unshuffledCards.keys());
  let toShuffle: number = cardIDs.length;
  let swapPosition: number;
  while (toShuffle) {
    swapPosition = Math.floor(Math.random() * toShuffle--);
    [cardIDs[toShuffle], cardIDs[swapPosition]] = [cardIDs[swapPosition], cardIDs[toShuffle]];
  }
  return cardIDs.reduce((shuffledCards: Map<string, Card>, cardID: string) => {
    return shuffledCards.set(cardID, unshuffledCards.get(cardID))
  }, new Map())
}

/* Helper functions */
function generateCardStructuresFromInputCardStructures(): CardStructure[] {
  return inputCardStructures.map((
    inputCardStructure: IInputCardStructure
  ) => {
    const requiredGemStoneMap: Map<GemStone, number> =
      inputCardStructure.requiredGemStones
        .reduce((
          map: Map<GemStone, number>,
          obj: IInputRequiredGemStones
        ) => {
          return map.set(obj.gemStone, obj.required)
        }, new Map());
    return {
      pointValue: inputCardStructure.pointValue,
      gemStoneType: inputCardStructure.gemStoneType,
      tier: inputCardStructure.tier,
      requiredGemStones: requiredGemStoneMap,
    }
  })
}
