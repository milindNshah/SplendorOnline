"use strict"
import { GlobalUtils } from '../utils/GlobalUtils'
import { Room } from './Room';
import { Board } from './Board';
import { InvalidGameError } from './Errors';
import { Player } from './Player';
import { GemStone } from './GemStone';
import { Card, CardTier } from './Card';
import * as GameManager from '../managers/GameManager';

const TARGET_SCORE = 15;
const MAX_GEMS_ALLOWED_HAVE = 10;
const MAX_GEMS_ALLOWED_RETURN = 3;

export interface GameEndTurn {
  actions: Map<ActionType, any>,
  playerID: string,
  gameID: string,
}

/* Should be kept in sync with actionttype.js on client */
export enum ActionType {
  TAKE_GEMS = "TakeGems",
  PURCHASE_ACTIVE_CARD = "PurchaseActiveCard",
  PURCHASE_RESERVED_CARD = "PurchaseReservedCard",
  RESERVE_ACTIVE_CARD = "ReserveActiveCard",
  RESERVE_DECK_CARD = "ReserveDeckCard",
  SKIP_TURN = "SkipTurn",
}

// TODO: Move into game manager. intervals map by gameid.
let gameInterval: NodeJS.Timeout = null;

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

  constructor (room: Room, board: Board, targetScore?: number) {
    this.id = this.createGameID();
    this.board = board;
    this.room = room;
    this.targetScore = targetScore ?? TARGET_SCORE;
    this.turnOrder = this.generateTurnOrder(Array.from(room.players.keys()))
    this.curTurnIndex = 0;
    this.gameTurn = 1;
    this.winner = null;
    this.tieBreakerMoreRounds = false;
    this.initialMinutes = 0;
    this.initialSeconds = 10;
    this.currentMinutes = 0;
    this.currentSeconds = 10;
    this.timerStarted = false;
  }

  createGameID(): string {
    return GlobalUtils.generateID();
  }

  generateTurnOrder(playerIDs: string[]): string[] {
    return GlobalUtils.shuffle(playerIDs);
  }

  startTimer(io: SocketIO.Server): this {
    // let gameInterval: NodeJS.Timeout = GameManager.getIntervalByID(this.id);
    // if(gameInterval !== null) {
    //   GameManager.clearIntervalByID(this.id)
    // }
    if(this.timerStarted === false) {
      console.log("timer Start: ", this.timerStarted);
      this.timerStarted = true;
      gameInterval = setInterval(() => {
        console.log(this.currentMinutes, this.currentSeconds)
        io.sockets.in(this.room.code).emit("TimerUpdate", {
          seconds: this.currentSeconds,
          minutes: this.currentMinutes,
        })
        if(this.currentSeconds > 0) {
          this.currentSeconds -= 1;
        } // TODO: Not sure if needs to be if or else if.
        else if (this.currentSeconds === 0) {
          if (this.currentMinutes === 0) {
            clearInterval(gameInterval)
            // GameManager.clearIntervalByID(this.id)
            this.timerStarted = false;
          } else {
            this.currentMinutes -= 1
            this.currentSeconds = 59
          }
        }
      }, 1000)
    }
    return this;
  }

  resetTimer(io: SocketIO.Server): this {
    // let gameInterval: NodeJS.Timeout = GameManager.getIntervalByID(this.id);
    // GameManager.clearIntervalByID(this.id)
    clearInterval(gameInterval)
    this.timerStarted = false;
    this.currentMinutes = this.initialMinutes;
    this.currentSeconds = this.initialSeconds;
    this.startTimer(io);
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
      const gemsToTansfer = Array.from(inputGemsToTransfer.keys())
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
      return this;
    } catch (err) {
      throw err;
    }
  }

  async reserveActiveCard(card: Card, player: Player): Promise<this> {
    try {
      if (!player.hand.canReserveCard()) {
        throw new InvalidGameError(`Can't reserve a card because you have already reserved 3 cards`);
      }
      await this.board.swapActiveCard(card);
      await player.hand.addToReserved(card);
      card.setReservedBy(player.id);
      const goldGemStoneObtained: boolean = await this.board.removeGoldGemStone();
      if (goldGemStoneObtained) {
        player.hand.takeGoldGemStone();
      }
      return this;
    } catch (err) {
      throw err;
    }
  }

  async reserveDeckCard(player: Player, tier: string): Promise<this> {
    try {
      if (!player.hand.canReserveCard()) {
        throw new InvalidGameError(`Can't reserve a card because you have already reserved 3 cards`);
      }
      const tierKey: CardTier = CardTier[`TIER${tier}` as keyof typeof CardTier]; // ew
      const card = await this.board.reserveDeckCard(tierKey);
      await player.hand.addToReserved(card);
      card.setReservedBy(player.id);
      const goldGemStoneObtained: boolean = await this.board.removeGoldGemStone();
      if (goldGemStoneObtained) {
        player.hand.takeGoldGemStone();
      }
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
      await this.board.swapActiveCard(card);
      const gemStonesToTransfer: Map<GemStone, number> = await this.getGemStonesToUseForPurchase(card, player);
      await player.hand.addToPurchased(gemStonesToTransfer, card);
      await this.board.addGemsFromPurchasedCard(gemStonesToTransfer);
      const noblesToTake = await this.board.takeNoblesIfValid(player);
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
      const noblesToTake = await this.board.takeNoblesIfValid(player);
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
      if(have + purchased >= need) {
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
    if (this.turnOrder[this.turnOrder.length - 1] === player.id) {
      this.checkScores();
      this.curTurnIndex = 0;
      this.gameTurn += 1;
    } else {
      this.curTurnIndex += 1;
    }
    player.hand.incrementTurn();
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
    // Go more rounds until someone has more points or
    // breaks one of the other tie conditions
    // TODO: Implement more options that users can select for tiebreaker
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
}
