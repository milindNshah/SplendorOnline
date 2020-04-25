"use strict"

import { CardGemStone } from "../models/GemStone";
import { Noble } from "../models/Noble";
import { GlobalUtils } from "../utils/GlobalUtils";

export function createNewNoble(
  requiredCards: Map<CardGemStone, number>
): Noble {
  return new Noble(requiredCards);
}

export function shuffleNobles(unshuffledNobles: Map<string, Noble>): Map<string, Noble> {
  return GlobalUtils.shuffleMap(unshuffledNobles);
}
