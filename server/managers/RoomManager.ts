"use strict"
import { Room } from '../models/Room';
import { Player } from '../models/Player';
import { InvalidRoomCodeError } from '../models/Errors';

const rooms: Map<string, Room> = new Map();

export function addRoom(room: Room): Map<string, Room> {
  rooms.set(room.code, room);
  return rooms;
}

export function getAllRooms(): Map<string, Room> {
  return rooms;
}

export async function getRoomByCode(roomCode: string): Promise<Room> {
  roomCode = roomCode.trim()
  if (roomCode === undefined || roomCode === null || !roomCode) {
    throw new InvalidRoomCodeError(`Room code cannot be empty`);
  }
  roomCode = roomCode.toUpperCase();
  const room: Room = rooms.get(roomCode);
  if (room === undefined || room === null || !room) {
    throw new InvalidRoomCodeError(`Invalid room code: ${roomCode}`);
  }
  return room;
}

export function getRoomByPlayer(playerID: string): Room {
  for (let room of Array.from(rooms.values())) {
    if(room.hasPlayer(playerID)) {
      return room;
    }
  }
  return null;
}

export async function removePlayerFromRoom(room: Room, player: Player): Promise<Room> {
  try {
    await room.removePlayer(player.id);
    if (player.isHost) {
      await room.makeNewHost();
    }
    if (room.players.size <= 0) {
      removeRoom(room);
    }
    return room;
  } catch (err) {
    throw (err);
  }
}

export function removeRoom(room: Room):Map<string, Room> {
  rooms.delete(room.code);
  return rooms;
}
