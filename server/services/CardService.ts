"use strict"

import { Card, CardStructure } from "../models/Card";

export function createNewCard(
  cardStructure: CardStructure,
): Card {
  return new Card(
    cardStructure.pointValue,
    cardStructure.gemStoneValue,
    cardStructure.tier,
    cardStructure.requiredGemStones
  );
}
