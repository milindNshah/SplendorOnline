"use strict";
import { Room, RoomService} from './models/Room'

let io;
let socket;

export class SocketEvents {
    static initRoomEvents(ioparam: SocketIO.Server, socketparam: SocketIO.Socket): void {
        io = ioparam;
        socket = socketparam;
        socket.on('createNewRoom', RoomService.createNewRoom)
    }
}
