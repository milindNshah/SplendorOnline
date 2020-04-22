"use strict"
import { Room } from './models/Room';

const rooms: Map<string, Room> = new Map();

export function addRoom(room: Room): Map<string, Room> {
  rooms.set(room.code, room);
  return rooms;
}

export function getRoomByCode(roomCode: string): Room {
  return rooms.get(roomCode) ?? null;
}
