"use strict"
import { Player } from './models/Player';

const players: Map<string, Player> = new Map();

export function addPlayer(player: Player): Map<string, Player> {
  players.set(player.socketID, player)
  return players;
}

export function getValidatedPlayerBySocketID(socketID: string): Player {
  const player = getPlayerBySocketID(socketID);
  if(player === null) {
    return null;
    // TODO: Shouldn't crash server, send error to client
    // throw new Error("Invalid Room Code");
  }
  return player;
}

export function removePlayer(player: Player): Map<string, Player> {
  players.delete(player.socketID);
  return players;
}

/* Helper Functions */
function getPlayerBySocketID(socketID: string): Player {
  return players.get(socketID) ?? null;
}
