"use strict";
import { User, UserService } from '../models/User';
import { GlobalUtils } from '../globalUtils';

export class Room  {
    host: User;
    players: User[];
    code: string;
    id: string;

    constructor(host: User) {
        this.host = host;
        this.players = [];
        this.players.push(host);
        this.id = this.createRoomID();
        this.code = this.createRoomCode();
    }

    createRoomID(): string {
        return GlobalUtils.generateID();
    }

    createRoomCode(): string {
        return GlobalUtils.generateID(2);
    }
}

export class RoomService {
    static createNewRoom(name: string, socketID: string): Room {
        const host: User = UserService.createNewUser(name, socketID, true);
        return new Room(host);
    }
}
