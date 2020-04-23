"use strict";
export async function handleError(err: any) {
  if(err.isOperational) {
    console.error(`An error of type ${err.name} was found: ${err.stack}`);
  } else {
    console.error(`An unexpected error occurred: ${err}`);
    process.exit(1);
  }
}
