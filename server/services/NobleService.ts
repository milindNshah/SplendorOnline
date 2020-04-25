"use strict"

import { CardGemStone } from "../models/GemStone";
import { Noble } from "../models/Noble";

export function createNewNoble(
  requiredCards: Map<CardGemStone, number>
): Noble {
  return new Noble(requiredCards);
}
