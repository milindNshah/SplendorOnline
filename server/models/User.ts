"use strict";

export class User {
    socketID: string;
    name: string;
    isReady: boolean;
    isHost: boolean;
    playerID: string;

    constructor(name: string, socketID: string) {
        this.name = name;
        this.socketID = socketID;
        this.isReady = false;
        this.isHost = false;
        this.playerID = this.createPlayerID(name, socketID);
    }

    createPlayerID(name: string, socketID: string): string {
        return "";
    }
}
