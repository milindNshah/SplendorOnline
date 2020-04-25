"use strict";
export async function handleError(err: any, io?: SocketIO.Server, socketID?: string) {
  if (err.isOperational) {
    console.error(`An error of type ${err.name} was found: ${err.stack}`)
    if (io && socketID) {
      io.to(socketID).emit(`ClientRequestError`, {
        name: err.name,
        message: err.message,
        isOperational: err.isOperational
      });
    }
  } else {
    console.error(`An unexpected error occurred: ${err}: ${err.stack}`);
    io.emit(`ServerError`, "An unexpected error occured.");
    process.exit(1);
  }
}
