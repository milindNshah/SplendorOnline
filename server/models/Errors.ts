"use strict"

/* Should be kept in sync with errors.js on client */
export enum ErrorType {
  INVALID_INPUT = 'InvalidInput',
  ROOM_DOES_NOT_EXIST = 'RoomDoesNotExist',
  USER_SERVICE = 'UserService',
  CARD_GENERATION_ERROR = 'CardGenerationError',
  NOBLE_GENERATION_ERROR = 'NobleGenerationError',
  INVALID_GAME_ACTION = 'InvalidGameActionError',
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

export class InvalidRoomCodeError extends InvalidInputError {
  constructor (...args: string[]) {
    super(...args);
    this.name = ErrorType.ROOM_DOES_NOT_EXIST;
    this.isOperational = true;
  }
}

export class CardGenerationError extends BaseError {
  constructor (...args: string[]) {
    super(...args);
    this.name = ErrorType.CARD_GENERATION_ERROR;
    this.isOperational = true;
  }
}

export class NobleGenerationError extends BaseError {
  constructor (...args: string[]) {
    super(...args);
    this.name = ErrorType.NOBLE_GENERATION_ERROR;
    this.isOperational = true;
  }
}

export class InvalidGameError extends BaseError {
  constructor (...args: string[]) {
    super(...args);
    this.name = ErrorType.INVALID_GAME_ACTION;
    this.isOperational = true;
  }
}
