"use strict"

export enum ErrorType {
  INVALID_INPUT = 'InvalidInput',
  ROOM_DOES_NOT_EXIST = 'RoomDoesNotExist',
  USER_SERVICE = 'UserService',
}

export class BaseError extends Error {
  isOperational: boolean;
  constructor (...args: string[]) {
    super(...args);
    this.message = this.message;
    this.stack = `${this.message}\n${new Error().stack}`;
  }
}

export class InvalidInputError extends BaseError {
  constructor (...args: string[]) {
    super(...args);
    this.name = ErrorType.INVALID_INPUT;
    this.isOperational = true;
  }
}

export class UserServiceError extends BaseError {
  constructor (...args: string[]) {
    super(...args);
    this.name = ErrorType.USER_SERVICE;
    this.isOperational = true;
  }
}

export class InvalidRoomCodeError extends BaseError {
  constructor (...args: string[]) {
    super(...args);
    this.name = ErrorType.ROOM_DOES_NOT_EXIST;
    this.isOperational = true;
  }
}
