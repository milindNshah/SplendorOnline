"use strict"
import { Player } from './models/Player';

const players: Map<string, Player> = new Map();

export function addPlayer(player: Player): Map<string, Player> {
  players.set(player.socketID, player)
  return players;
}

export function getPlayerBySocketID(socketID: string): Player {
  return players.get(socketID) ?? null;
}

export function removePlayer(player: Player): Map<string, Player> {
  players.delete(player.socketID);
  return players;
}
