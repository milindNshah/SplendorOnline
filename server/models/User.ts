"use strict";
import { GlobalUtils } from '../globalUtils';

export class User {
    id: string;
    isHost: boolean;
    isReady: boolean;
    name: string;
    socketID: string;

    constructor(name: string, socketID: string, isHost?: boolean) {
        this.id = this.createUserID();
        this.name = name;
        this.socketID = socketID;
        this.isReady = false;
        this.isHost = isHost ?? false;
    }

    createUserID(): string {
        return GlobalUtils.generateID();
    }
}

export class UserService {
    static createNewUser(name: string, socketID: string, isHost?: boolean): User {
        return new User(name, socketID, isHost);
    }
}
