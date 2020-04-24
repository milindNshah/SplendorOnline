"use strict"

import { Room } from "../models/Room";
import { Game } from "../models/Game";
import { InvalidInputError } from "../utils/Errors";
import * as GameManager from "../managers/GameManager";

export async function createNewGame(room: Room): Promise<Game> {
  if(!room || !room.id || !room.code) {
    throw new InvalidInputError("Invalid room give");
  }
  room.toggleGameStarted(true);
  const game: Game = new Game(room);
  GameManager.addGame(game);
  return game;
}
