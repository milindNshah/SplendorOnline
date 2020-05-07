"use strict"
import { Game } from "../models/Game"
import { InvalidInputError } from "../models/Errors";

const games: Map<string, Game> = new Map();
const gameIntervals: Map<string, NodeJS.Timeout> = new Map();

export function addGame(game: Game): Map<string, Game> {
  games.set(game.id, game);
  gameIntervals.set(game.id, null);
  return games;
}

export async function getGameByID(gameID: string): Promise<Game> {
  if(gameID === undefined || gameID === null || !gameID) {
    throw new InvalidInputError(`GameID cannot be empty`);
  }
  const game = games.get(gameID);
  if(game === undefined || game === null || !game) {
    throw new InvalidInputError(`Invalid game id: ${gameID}`);
  }
  return game;
}

export async function removeGame(game: Game): Promise<Map<string, Game>> {
  games.delete(game.id);
  return games;
}

export function getIntervalByID(gameID: string): NodeJS.Timeout {
  return gameIntervals.get(gameID);
}

export function setIntervalByID(gameID: string, interval: NodeJS.Timeout) {
  gameIntervals.set(gameID, interval);
}

export function clearIntervalByID(gameID: string) {
  clearInterval(gameIntervals.get(gameID));
  gameIntervals.set(gameID, null);
}
