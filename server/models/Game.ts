"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { Room } from './Room';
import { Board } from './Board';
import { InvalidGameError } from './Errors';
import { Player } from './Player';
import { GemStone } from './GemStone';
import { Card, CardTier } from './Card';
import * as GameManager from '../managers/GameManager';
import { Noble } from './Noble';
import * as RoomManager from '../managers/RoomManager'
import { serialize } from 'bson';
import * as Socket from '../utils/Socket';

const TARGET_SCORE = 15;
const MAX_GEMS_ALLOWED_HAVE = 10;
const MAX_GEMS_ALLOWED_RETURN = 3;

export interface GameEndTurn {
  actions: Map<ActionType, any>,
  playerID: string,
  gameID: string,
}

export interface GameAction {
  type: ActionType,
  player?: Player,
  card?: Card,
  transferredGems?: Map<GemStone, number>,
  obtainedNobles?: Noble[],
}

/* Should be kept in sync with actiontype.js on client */
export enum ActionType {
  START_GAME = "StartGame",
  JOIN_GAME = "JoinGame",
  TAKE_GEMS = "TakeGems",
  PURCHASE_ACTIVE_CARD = "PurchaseActiveCard",
  PURCHASE_RESERVED_CARD = "PurchaseReservedCard",
  RESERVE_ACTIVE_CARD = "ReserveActiveCard",
  RESERVE_DECK_CARD = "ReserveDeckCard",
  NEW_ACTIVE_CARD = "NewActiveCard",
  OBTAIN_NOBLE = "ObtainNoble",
  SKIP_TURN = "SkipTurn",
  LEAVE_GAME = "LeaveGame",
  DISCONNECTED = "Disconnected",
  GAME_ENDED = "GameEnded",
}

export class Game {
  id: string;
  board: Board;
  room: Room;
  targetScore: number;
  turnOrder: string[];
  curTurnIndex: number;
  gameTurn: number;
  winner: Player;
  tieBreakerMoreRounds: boolean;
  initialMinutes: number;
  initialSeconds: number;
  currentMinutes: number;
  currentSeconds: number;
  timerStarted: boolean;
  actionLog: GameAction[];

  constructor (room: Room, board: Board, targetScore?: number) {
    this.id = this.createGameID();
    this.actionLog = [];
    this.board = board;
    this.room = room;
    this.targetScore = targetScore ?? TARGET_SCORE;
    this.turnOrder = this.generateTurnOrder(Array.from(room.players.keys()))
    this.curTurnIndex = 0;
    this.gameTurn = 1;
    this.winner = null;
    this.tieBreakerMoreRounds = false;
    this.initialMinutes = 2;
    this.initialSeconds = 0;
    this.currentMinutes = 2;
    this.currentSeconds = 0;
    this.timerStarted = false;
  }

  createGameID(): string {
    return GlobalUtils.generateID();
  }

  generateTurnOrder(playerIDs: string[]): string[] {
    return GlobalUtils.shuffle(playerIDs);
  }

  // This feels very hacky.
  startTimer(): this {
    if(this.timerStarted === false) {
      this.timerStarted = true;
      GameManager.setIntervalByID(this.id, setInterval(() => {
        let io: SocketIO.Server = Socket.getIO();
        if(io && io.sockets.in(this.room.code)) {
          io.sockets.in(this.room.code).emit("TimerUpdate", {
            seconds: this.currentSeconds,
            minutes: this.currentMinutes,
          })
        }
        if(this.currentSeconds > 0) {
          this.currentSeconds -= 1;
        }
        else if (this.currentSeconds === 0) {
          if (this.currentMinutes === 0) {
            GameManager.clearIntervalByID(this.id)
            this.timerStarted = false;
          } else {
            this.currentMinutes -= 1
            this.currentSeconds = 59
          }
        }
      }, 1000))
    }
    return this;
  }

  resetTimer(): this {
    GameManager.clearIntervalByID(this.id)
    this.timerStarted = false;
    this.currentMinutes = this.initialMinutes;
    this.currentSeconds = this.initialSeconds;
    this.startTimer();
    return this;
  }

  stopTimer(): this {
    GameManager.clearIntervalByID(this.id)
    this.timerStarted = false;
    return this;
  }

  async checkValidTurn(playerID: string): Promise<boolean> {
    if (playerID !== this.turnOrder[this.curTurnIndex]) {
      throw new InvalidGameError(`It is not player ${playerID}'s turn right now.`)
    }
    return true;
  }

  async transferGems(inputGemsToTransfer: Map<string, number>, player: Player): Promise<this> {
    try {
      const gemsToTansfer: Map<GemStone, number> = Array.from(inputGemsToTransfer.keys())
        .reduce((map: Map<GemStone, number>, gemStoneName: string) => {
          let gemStoneKey: GemStone = GemStone[gemStoneName.toUpperCase() as keyof typeof GemStone] // ew
          if (inputGemsToTransfer.get(gemStoneName) === 0) {
            return map;
          }
          return map.set(gemStoneKey, inputGemsToTransfer.get(gemStoneName));
        }, new Map())
      const totalGemsTaken: number = Array.from(gemsToTansfer.values())
        .reduce((acc: number, amount: number) => {
          return acc = amount > 0 ? acc + amount : acc;
        }, 0)
      const totalGemsReturned: number = Array.from(gemsToTansfer.values())
        .reduce((acc: number, amount: number) => {
          return acc = amount < 0 ? acc - amount : acc;
        }, 0)
      const totalGemsOwned: number = Array.from(player.hand.gemStones.values())
        .reduce((acc: number, amount: number) => {
          return acc += amount;
        }, 0)
      const totalGemChange = totalGemsTaken - totalGemsReturned;
      const numGemsAllowedToReturn = (totalGemsOwned > MAX_GEMS_ALLOWED_HAVE - MAX_GEMS_ALLOWED_RETURN)
        ? MAX_GEMS_ALLOWED_RETURN - (MAX_GEMS_ALLOWED_HAVE - totalGemsOwned)
        : 0;
      if (totalGemChange > 3 || totalGemsTaken > 3) {
        throw new InvalidGameError(`Can't take more than 3 gem stones`);
      }
      if (totalGemChange < -3 || totalGemsReturned > 3) {
        throw new InvalidGameError(`Can't put back more than 3 gem stones`);
      }
      if (totalGemsReturned > numGemsAllowedToReturn) {
        throw new InvalidGameError(`Can't return any more gems stones until total gems stones in hand is greater than ${MAX_GEMS_ALLOWED_HAVE}`);
      }
      if (totalGemsReturned > totalGemsTaken) {
        throw new InvalidGameError(`Can't return more gem stones than you have taken.`)
      }
      if (totalGemsOwned + totalGemsTaken < MAX_GEMS_ALLOWED_HAVE && totalGemsReturned > 0) {
        throw new InvalidGameError(`Can't return any gem stones while if total gem stone count would become less than ${MAX_GEMS_ALLOWED_HAVE}`)
      }
      if (totalGemsOwned + totalGemChange > MAX_GEMS_ALLOWED_HAVE) {
        throw new InvalidGameError(`Can't take more than a total of ${MAX_GEMS_ALLOWED_HAVE} gems`)
      }
      await this.board.transferGems(gemsToTansfer);
      await player.hand.transferGems(gemsToTansfer);
      const takeGemsAction: GameAction = {
        type: ActionType.TAKE_GEMS,
        player: player,
        transferredGems: gemsToTansfer,
      }
      this.addGameActionToLog(takeGemsAction);
      return this;
    } catch (err) {
      throw err;
    }
  }

  async reserveActiveCard(card: Card, player: Player, returnedToken: string): Promise<this> {
    try {
      if (!player.hand.canReserveCard()) {
        throw new InvalidGameError(`Can't reserve a card because you have already reserved 3 cards`);
      }
      const goldTokensLeft: number = this.board.availableGemStones.get(GemStone.GOLD)
      const transferredGemStones: Map<GemStone, number> = new Map();
      if (!player.hand.canTakeGoldToken() && goldTokensLeft > 0) {
        if (!returnedToken) {
          throw new InvalidGameError(`Must return a token in order to take another gold token`)
        }
        const returnedGemStone: GemStone = GemStone[returnedToken.toUpperCase() as keyof typeof GemStone] // ew
        await player.hand.returnGemStone(returnedGemStone)
        await this.board.addGemStone(returnedGemStone)
        transferredGemStones.set(returnedGemStone, -1)
      }
      const newActiveCard: Card = await this.board.swapActiveCard(card);
      await player.hand.addToReserved(card);
      card.setReservedBy(player.id);
      const goldGemStoneObtained: boolean = await this.board.removeGoldGemStone();
      if (goldGemStoneObtained) {
        player.hand.takeGoldGemStone();
        if(transferredGemStones.has(GemStone.GOLD)) {
          transferredGemStones.set(GemStone.GOLD, transferredGemStones.get(GemStone.GOLD) + 1);
        } else {
          transferredGemStones.set(GemStone.GOLD, 1);
        }
      }
      const reserveActiveCardAction: GameAction = {
        type: ActionType.RESERVE_ACTIVE_CARD,
        player: player,
        transferredGems: transferredGemStones,
        card: card,
      }
      this.addGameActionToLog(reserveActiveCardAction);
      const newActiveCardAction: GameAction = {
        type: ActionType.NEW_ACTIVE_CARD,
        card: newActiveCard,
      }
      this.addGameActionToLog(newActiveCardAction);
      return this;
    } catch (err) {
      throw err;
    }
  }

  async reserveDeckCard(player: Player, tier: string, returnedToken: string): Promise<this> {
    try {
      if (!player.hand.canReserveCard()) {
        throw new InvalidGameError(`Can't reserve a card because you have already reserved 3 cards`);
      }
      const goldTokensLeft: number = this.board.availableGemStones.get(GemStone.GOLD)
      const transferredGemStones: Map<GemStone, number> = new Map();
      if (!player.hand.canTakeGoldToken() && goldTokensLeft > 0) {
        if (!returnedToken) {
          throw new InvalidGameError(`Must return a token in order to take another gold token`)
        }
        const returnedGemStone: GemStone = GemStone[returnedToken.toUpperCase() as keyof typeof GemStone] // ew
        await player.hand.returnGemStone(returnedGemStone)
        await this.board.addGemStone(returnedGemStone)
        transferredGemStones.set(returnedGemStone, -1)
      }
      const tierKey: CardTier = CardTier[`TIER${tier}` as keyof typeof CardTier]; // ew
      const card = await this.board.reserveDeckCard(tierKey);
      await player.hand.addToReserved(card);
      card.setReservedBy(player.id);
      const goldGemStoneObtained: boolean = await this.board.removeGoldGemStone();
      if (goldGemStoneObtained) {
        player.hand.takeGoldGemStone();
        if(transferredGemStones.has(GemStone.GOLD)) {
          transferredGemStones.set(GemStone.GOLD, transferredGemStones.get(GemStone.GOLD) + 1);
        } else {
          transferredGemStones.set(GemStone.GOLD, 1);
        }
      }
      const reserveDeckCardAction: GameAction = {
        type: ActionType.RESERVE_DECK_CARD,
        player: player,
        transferredGems: transferredGemStones,
        card: card,
      }
      this.addGameActionToLog(reserveDeckCardAction);
      return this;
    } catch (err) {
      throw err;
    }
  }

  async hackForNobles(player: Player): Promise<this> {
    try {
      const unlimitedGems: Map<GemStone, number> = new Map([
        [GemStone.DIAMOND, 99],
        [GemStone.SAPPHIRE, 99],
        [GemStone.EMERALD, 99],
        [GemStone.RUBY, 99],
        [GemStone.CHOCOLATE, 99],
        [GemStone.GOLD, 99],
      ])
      player.hand.transferGems(unlimitedGems);
      const cards = Array.from(this.board.activeTieredCards.get(CardTier.TIER1).values())
      for (let card of cards) {
        await this.board.swapActiveCard(card);
        const gemStonesToTransfer: Map<GemStone, number> = await this.getGemStonesToUseForPurchase(card, player);
        await player.hand.addToPurchased(gemStonesToTransfer, card);
        await player.hand.updateScore();
      }
      return this;
    } catch (err) {
      throw err;
    }
  }

  async purchaseActiveCard(card: Card, player: Player): Promise<this> {
    try {
      if (!player.hand.canPurchaseCard(card)) {
        throw new InvalidGameError(`Can't purchase card: You Must Construct Additional Gems`);
      }
      const newActiveCard = await this.board.swapActiveCard(card);
      const gemStonesToTransfer: Map<GemStone, number> = await this.getGemStonesToUseForPurchase(card, player);
      await player.hand.addToPurchased(gemStonesToTransfer, card);
      await this.board.addGemsFromPurchasedCard(gemStonesToTransfer);

      const purchaseActiveCardAction: GameAction = {
        type: ActionType.PURCHASE_ACTIVE_CARD,
        player: player,
        transferredGems: gemStonesToTransfer,
        card: card,
      }
      this.addGameActionToLog(purchaseActiveCardAction);
      const newActiveCardAction: GameAction = {
        type: ActionType.NEW_ACTIVE_CARD,
        card: newActiveCard,
      }
      this.addGameActionToLog(newActiveCardAction);

      const noblesToTake = await this.board.takeNoblesIfValid(player);
      if(noblesToTake.length > 0) {
        const obtainNoblesAction: GameAction = {
          type: ActionType.OBTAIN_NOBLE,
          player: player,
          obtainedNobles: noblesToTake,
        }
        this.addGameActionToLog(obtainNoblesAction);
      }

      player.hand.addToNobles(noblesToTake)
      await player.hand.updateScore();
      return this;
    } catch (err) {
      throw err;
    }
  }

  async purchaseReservedCard(card: Card, player: Player): Promise<this> {
    try {
      if (!card.reservedBy || card.reservedBy !== player.id) {
        throw new InvalidGameError(`You cannot purchase someone else's reserved card.`)
      }
      if (!player.hand.canPurchaseCard(card)) {
        throw new InvalidGameError(`Can't purchase card: You Must Construct Additional Gems`);
      }
      const gemStonesToTransfer: Map<GemStone, number> = await this.getGemStonesToUseForPurchase(card, player);
      await player.hand.purchaseReservedCard(card);
      await player.hand.addToPurchased(gemStonesToTransfer, card);
      await this.board.addGemsFromPurchasedCard(gemStonesToTransfer);

      const purchaseReservedCardAction: GameAction = {
        type: ActionType.PURCHASE_RESERVED_CARD,
        player: player,
        transferredGems: gemStonesToTransfer,
        card: card,
      }
      this.addGameActionToLog(purchaseReservedCardAction);

      const noblesToTake = await this.board.takeNoblesIfValid(player);
      if(noblesToTake.length > 0) {
        const obtainNoblesAction: GameAction = {
          type: ActionType.OBTAIN_NOBLE,
          player: player,
          obtainedNobles: noblesToTake,
        }
        this.addGameActionToLog(obtainNoblesAction);
      }

      player.hand.addToNobles(noblesToTake)
      await player.hand.updateScore();
      return this;
    } catch (err) {
      throw err;
    }
  }

  async getGemStonesToUseForPurchase(card: Card, player: Player): Promise<Map<GemStone, number>> {
    const purchasedCards: Map<GemStone, Card[]> = player.hand.getPurchasedCardsByTypes()
    let goldLeft: number = player.hand.gemStones.get(GemStone.GOLD);
    const toTransfer = Array.from(card.requiredGemStones.keys())
    .reduce((map: Map<GemStone, number>, gemStone: GemStone) => {
      const have: number = player.hand.gemStones.get(gemStone);
      const need: number = card.requiredGemStones.get(gemStone);
      const purchased: number = purchasedCards.get(gemStone)
        ? purchasedCards.get(gemStone).length
        : 0;
      if(purchased >= need) {
        map.set(gemStone, 0)
      } else if(have + purchased >= need) {
        map.set(gemStone, need-purchased)
      } else if (goldLeft > 0 && have + purchased + goldLeft >= need) {
        goldLeft -= need - (have + purchased)
        map.set(gemStone, have)
      } else {
        throw new InvalidGameError(`Can't purchase card: You Must Construct Additional Gems`);
      }
      return map;
    }, new Map())
    toTransfer.set(GemStone.GOLD, (player.hand.gemStones.get(GemStone.GOLD) - goldLeft))
    return toTransfer;
  }

  finishTurn(player: Player): this {
    const allDisconnected = Array.from(this.room.players.values())
      .reduce((all: boolean, player: Player) => {
        return all && !player.isConnected
      }, true)
    if(allDisconnected) {
      // TODO: Add logic to end a game and then delete it somehow. Need to do for actual game ending anyways.
      console.log("all disconnected!")
      return;
    }

    if (this.turnOrder[this.turnOrder.length - 1] === player.id) {
      this.checkScores();
      this.curTurnIndex = 0;
      this.gameTurn += 1;
    } else {
      this.curTurnIndex += 1;
    }
    player.hand.incrementTurn();

    // Check if nextPlayer is there.
    const nextPlayer: Player = this.room.getPlayer(this.turnOrder[this.curTurnIndex]);
    if(!nextPlayer.isConnected) {
      const skipTurnAction: GameAction = {
        type: ActionType.SKIP_TURN,
        player: nextPlayer,
      }
      this.addGameActionToLog(skipTurnAction);
      this.finishTurn(nextPlayer);
    }
    return this;
  }

  async handlePlayerTempDisconnected(player: Player): Promise<this> {
    try {
      let wasDisconnetedPlayerTurn: boolean = false;
      if (player.id === this.turnOrder[this.curTurnIndex]) {
        wasDisconnetedPlayerTurn = true;
        this.finishTurn(player);
      }
      player.setDisconnected();
      if (wasDisconnetedPlayerTurn) {
        if (!this.winner) {
          this.resetTimer();
        } else {
          this.stopTimer();
        }
      }
      const disconnectedAction: GameAction = {
        type: ActionType.DISCONNECTED,
        player: player,
      }
      this.addGameActionToLog(disconnectedAction);

      const promise = new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            await this.handlePlayerDisconnected(player)
            resolve()
          } catch (err) {
            reject(err)
          }
        }, 5000)
      })
      promise
        .catch(err => { throw err })
      return this;
    } catch (err) {
      throw err;
    }
  }

  async handlePlayerDisconnected(player: Player): Promise<this> {
    try {
      this.handlePlayerLeftGame(player);
      await RoomManager.removePlayerFromRoom(this.room, player);
      const io: SocketIO.Server = Socket.getIO();
      io.sockets.in(this.room.code).emit("UpdateRoom", serialize(this.room));
      io.sockets.in(this.room.code).emit("PlayerLeft", serialize(this));
      return this;
    } catch (err) {
      throw err;
    }
  }

  handlePlayerLeftGame(player: Player): this {
    let wasDisconnetedPlayerTurn: boolean = false;
    if(player.id === this.turnOrder[this.curTurnIndex]) {
      wasDisconnetedPlayerTurn = true;
      this.finishTurn(player);
    }
    const curPlayerID = this.turnOrder[this.curTurnIndex];
    this.turnOrder = this.turnOrder.filter((playerID) => playerID !== player.id);
    this.curTurnIndex = this.turnOrder.indexOf(curPlayerID);
    this.board.takeAllGemStonesFromDisconnectedPlayer(player);
    if(wasDisconnetedPlayerTurn) {
      if (!this.winner) {
        this.resetTimer();
      } else {
        this.stopTimer();
      }
    }
    const leaveGameAction: GameAction = {
      type: ActionType.LEAVE_GAME,
      player: player,
    }
    this.addGameActionToLog(leaveGameAction);
    return this;
  }

  private checkScores(): this {
    const players: Map<string, Player> = this.room.players;
    const playersWon = Array.from(players.values())
      .filter((player) => player.hand.score >= 15);

    if (playersWon.length < 1) {
      return this;
    }
    if (playersWon.length === 1) {
      this.winner = playersWon.pop();
      this.tieBreakerMoreRounds = false;
      return this;
    }
    // Tie Breaker
    const highestScorePlayers: Player[]
      = this.checkHighestScoreOnTie(playersWon);
    if (highestScorePlayers.length === 1) {
      this.winner = highestScorePlayers.pop()
      this.tieBreakerMoreRounds = false;
      return this;
    }
    const leastCardPlayers: Player[]
      = this.checkLeastCardsOnTie(highestScorePlayers)
    if (leastCardPlayers.length === 1) {
      this.winner = leastCardPlayers.pop()
      this.tieBreakerMoreRounds = false;
      return this;
    }
    // Go more rounds until someone breaks a tie breaker condition
    this.tieBreakerMoreRounds = true;
    return this;
  }

  private checkHighestScoreOnTie(players: Player[]): Player[] {
    const maxScore: number = players
      .reduce((a, b) => a.hand.score > b.hand.score ? a : b)
      .hand.score;
    return players.filter(
      (player) => player.hand.score === maxScore
    );
  }

  private checkLeastCardsOnTie(players: Player[]): Player[] {
    const leastCards: number = players.reduce(
      (a, b) => a.hand.purchasedCards.size < b.hand.purchasedCards.size ? a : b
    ).hand.purchasedCards.size;
    return players.filter(
      (player) => player.hand.purchasedCards.size === leastCards
    );
  }

  addStartGameAction(): this {
    const startGameAction: GameAction = {
      type: ActionType.START_GAME,
    }
    return this.addGameActionToLog(startGameAction);
  }

  addJoinGameAction(player: Player): this {
    const joinGameAction: GameAction = {
      type: ActionType.JOIN_GAME,
      player: player,
    }
    return this.addGameActionToLog(joinGameAction);
  }

  addSkipTurnAction(player: Player): this {
    const skipTurnAction: GameAction = {
      type: ActionType.SKIP_TURN,
      player: player,
    }
    return this.addGameActionToLog(skipTurnAction);
  }

  addGameActionToLog(data: GameAction): this {
    this.actionLog.push(data);
    return this;
  }
}
