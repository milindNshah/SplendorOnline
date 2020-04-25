"use strict"

import { Board } from "../models/Board";
import { InvalidInputError } from "../models/Errors";

export async function createNewBoard(numPlayers: number): Promise<Board> {
  if(!numPlayers || numPlayers < 2 || numPlayers > 4) {
    throw new InvalidInputError(`Invalid number of players in room: ${numPlayers}`)
  }
  return new Board(numPlayers);
}
