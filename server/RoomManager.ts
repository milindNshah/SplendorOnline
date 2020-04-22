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

export function getAllRooms(): Map<string, Room> {
  return rooms;
}

export function checkValidRoomCode(roomCode: string): boolean {
  const valid = getRoomByCode(roomCode);
  if (valid === null) {
    throw new Error("Invalid Room Code");
  }
  return true;
}
