"use strict"

import { Card, CardStructure, CardTier } from "../models/Card"
import * as CardService from "../services/CardService"
import { GemStone } from "../models/GemStone";
import { IInputCardStructure, IInputRequiredGemStones, inputCardStructures } from "../utils/CardInputUtils";

const cards: Map<string, Card> = new Map();

export function generateAllCards(): Map<string, Card> {
  const generatedCardStructures: CardStructure[] = generateCardStructuresFromInputCardStructures();
  generatedCardStructures.map((generatedCardStructure: CardStructure) => {
    const card: Card = CardService.createNewCard(generatedCardStructure);
    cards.set(card.id, card);
  })
  return cards;
}

export function getAllCards(): Map<string, Card> {
  return cards;
}

export function getTier1Cards(): Map<string, Card> {
  return getTierCards(CardTier.TIER1);
}

export function getTier2Cards(): Map<string, Card> {
  return getTierCards(CardTier.TIER2);
}

export function getTier3Cards(): Map<string, Card> {
  return getTierCards(CardTier.TIER3);
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
      gemStoneValue: inputCardStructure.gemStoneValue,
      tier: inputCardStructure.tier,
      requiredGemStones: requiredGemStoneMap,
    }
  })
}

function getTierCards(tier: CardTier): Map<string, Card> {
  return Array.from(cards.values())
    .filter((card: Card) => {
      return card.tier === tier
    }).reduce(function (tier1Cards: Map<string, Card>, card: Card) {
      return tier1Cards.set(card.id, card);
    }, new Map());
}
