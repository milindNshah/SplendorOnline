"use strict"
import { Room } from './models/Room';
import { Player } from './models/Player';
import { InvalidInputError } from './utils/Errors';

const rooms: Map<string, Room> = new Map();

export function addRoom(room: Room): Map<string, Room> {
  rooms.set(room.code, room);
  return rooms;
}

export function getAllRooms(): Map<string, Room> {
  return rooms;
}

export async function getRoomByCode(roomCode: string): Promise<Room> {
  roomCode = roomCode.toUpperCase();
  const room: Room = rooms.get(roomCode);
  if (room === undefined || room === null || !room) {
    throw new InvalidInputError(`Room code: ${roomCode} wasn't found`);
  }
  return room;
}

export async function removePlayerFromRooms(player: Player): Promise<Room[]> {
  const modifiedRooms: Room[] = [];
  try {
    for (let room of Array.from(rooms.values())) {
      if (room.hasPlayer(player.id)) {
        await removePlayerFromRoom(room, player);
        modifiedRooms.push(room);
      }
    }
    return modifiedRooms;
  } catch (err) {
    return err;
  }
}

export async function removePlayerFromRoom(room: Room, player: Player): Promise<Room> {
  try {
    await room.removePlayer(player.id);
    if (player.isHost) {
      await room.makeNewHost();
    }
    if (room.players.size <= 0) {
      await removeRoom(room);
    }
    return room;
  } catch (err) {
    throw (err);
  }
}

/* Helper Functions */
async function removeRoom(room: Room): Promise<Map<string, Room>> {
  rooms.delete(room.code);
  return rooms;
}
