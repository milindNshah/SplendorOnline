"use strict"

import { Card, CardStructure } from "../models/Card";
import { GlobalUtils } from "../utils/GlobalUtils";

export function createNewCard(
  cardStructure: CardStructure,
): Card {
  return new Card(
    cardStructure.pointValue,
    cardStructure.gemStoneType,
    cardStructure.tier,
    cardStructure.requiredGemStones
  );
}

export function shuffleCards(unshuffledCards: Map<string, Card>): Map<string, Card> {
  return GlobalUtils.shuffleMap(unshuffledCards);
}
