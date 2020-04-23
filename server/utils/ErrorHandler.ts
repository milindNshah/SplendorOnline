"use strict";
export async function handleError(err: any, io?: SocketIO.Server, socketID?: string) {
  if (err.isOperational) {
    console.error(`An error of type ${err.name} was found: ${err.stack}`)
    if(io && socketID) {
      io.to(socketID).emit("serverError", err);
    }
  } else {
    console.error(`An unexpected error occurred: ${err}`);
    process.exit(1);
  }
}
