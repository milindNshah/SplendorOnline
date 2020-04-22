"use strict"
import { Room } from './models/Room';

const rooms: Map<string, Room> = new Map();

export function addRoom(room: Room): Map<string, Room> {
  rooms.set(room.code, room);
  return rooms;
}

export function getRoomByCode(roomCode: string): Room {
  roomCode = roomCode.toUpperCase();
  return rooms.get(roomCode) ?? null;
}

export function getAllRooms(): Map<string, Room> {
  return rooms;
}

export function checkValidRoomCode(roomCode: string): boolean {
  const valid = getRoomByCode(roomCode);
  if (valid === null) {
    // TODO: Shouldn't crash server, send error to client
    // throw new Error("Invalid Room Code");
  }
  return true;
}

export function removePlayerFromRooms(playerID: string): Room[] {
  const modifiedRooms: Room[] = [];

  rooms.forEach((room)=> {
    if(room.hasPlayer(playerID)) {
      room.removePlayer(playerID)
      modifiedRooms.push(room);
    }
  });

  return modifiedRooms;
}
