"use strict"

import { Room } from "../models/Room";
import { Game } from "../models/Game";
import { InvalidInputError } from "../models/Errors";
import * as GameManager from "../managers/GameManager";
import { Board } from "../models/Board";
import * as BoardService from "../services/BoardService";
import * as HandService from "../services/HandService";

export async function createNewGame(room: Room): Promise<Game> {
  try {
    if (!room || !room.id || !room.code) {
      throw new InvalidInputError("Invalid room given");
    }
    const board: Board = await BoardService.createNewBoard(room.players.size);
    const game: Game = new Game(room, board);
    Array.from(room.players.values())
      .forEach((player) => player.setHand(HandService.createHand()))
    room.toggleGameStarted(true);
    room.setGameID(game.id);
    GameManager.addGame(game);
    game.addStartGameAction();
    return game;
  } catch (err) {
    throw err;
  }
}
