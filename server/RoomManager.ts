"use strict"
import { Room } from './models/Room';
import { Player } from './models/Player';

const rooms: Map<string, Room> = new Map();

export function addRoom(room: Room): Map<string, Room> {
  rooms.set(room.code, room);
  return rooms;
}

export function removeRoom(room: Room): Map<string, Room> {
  rooms.delete(room.code);
  return rooms;
}

export function getAllRooms(): Map<string, Room> {
  return rooms;
}

export function getValidatedRoomFromCode(roomCode: string): Room {
  const room = getRoomByCode(roomCode);
  if (room === null) {
    return null;
    // TODO: Shouldn't crash server, send error to client
    // throw new Error("Invalid Room Code");
  }
  return room;
}

export function removePlayerFromRooms(player: Player): Room[] {
  const modifiedRooms: Room[] = [];

  rooms.forEach((room)=> {
    if(room.hasPlayer(player.id)) {
      removePlayerFromRoom(room, player);
      modifiedRooms.push(room);
    }
  });

  return modifiedRooms;
}

export function removePlayerFromRoom(room: Room, player: Player): Room {
  room.removePlayer(player.id);
  if(player.isHost)  {
    room.makeNewHost();
  }
  if(room.players.size <= 0) {
    removeRoom(room);
    return room;
  }
  return room;
}

/* Helper Functions */
function getRoomByCode(roomCode: string): Room {
  roomCode = roomCode.toUpperCase();
  return rooms.get(roomCode) ?? null;
}
