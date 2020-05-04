import React from 'react';
import styled from 'styled-components'
import Button from '../styledcomponents/button.jsx'
import Board from './Board.jsx';
import Player from './Player.jsx';
import { deserialize } from 'bson';
import { socket } from '../socket';
import { ActionType } from '../enums/actiontype';
import theme from '../styledcomponents/theme.jsx'

const GameContainer = styled.div`
  margin-top: 2.5rem;
  text-align: center;
`
const Scorebox = styled.div`
  margin-bottom: 3rem;
`
const TargetScore = styled.h2`
  color: ${ props => props.theme.color.error};
`
const TurnName = styled.span`
  color: ${ props => props.theme.color.secondary};
  font-weight: bold;
`
const WinnerScreen = styled.div`
  background: ${ props => props.theme.color.grey};
  z-index: 5;
  display: flex;
  text-align: center;
  justify-content: center;
  color: white;
`

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      board: {},
      isPlayerTurn: false,
      curTurnIndex: 0,
      invalidInputError: null,
      serverError: null,
      gameID: this.props.gameID,
      gameTurn: 0,
      player: {},
      playerID: this.props.playerID,
      players: [],
      targetScore: null,
      tieBreakerMoreRounds: false,
      turnOrder: [],
      winner: null,
      actionType: null,
      actionData: null,
    }
    this.socket = socket;
    this.onClientRequestError = this.onClientRequestError.bind(this)
    this.onEndTurn = this.onEndTurn.bind(this)
    this.onGameUpdate = this.onGameUpdate.bind(this)
    this.onPurchaseActiveCard = this.onPurchaseActiveCard.bind(this)
    this.onPurchaseReservedCard = this.onPurchaseReservedCard.bind(this)
    this.onPurchaseTokens = this.onPurchaseTokens.bind(this)
    this.onReserveActiveCard = this.onReserveActiveCard.bind(this)
    this.onReserveTierCard = this.onReserveTierCard.bind(this)
    this.renderHand = this.renderHand.bind(this)
    this.renderHands = this.renderHands.bind(this)
    this.onHackNobles = this.onHackNobles.bind(this)
  }

  // TODO: Research ComponentWillMount()?
  componentDidMount() {
    this.socket.on('UpdateGame', this.onGameUpdate);
    this.socket.on('ClientRequestError', this.onClientRequestError);
    this.socket.emit('RequestGameUpdate', this.state.gameID);
  }

  componentWillUnmount() {
    this.socket.off('UpdateGame', this.onGameUpdate);
    this.socket.off('ClientRequestError', this.onClientRequestError);
  }

  onGameUpdate(data) {
    const game = deserialize(Buffer.from(data));
    const players = game.room.players;
    const player = players[this.state.playerID];
    const board = game.board;
    const curPlayerTurn = players[game.turnOrder[game.curTurnIndex]];
    const isPlayerTurn = curPlayerTurn.id === player.id;

    this.setState({
      actionType: null,
      actionData: null,
      curTurnIndex: game.curTurnIndex,
      gameTurn: game.gameTurn,
      targetScore: game.targetScore,
      turnOrder: game.turnOrder,
      winner: game.winner,
      tieBreakerMoreRounds: game.tieBreakerMoreRounds,
      board: board,
      isPlayerTurn: isPlayerTurn,
      player: player,
      players: players,
    });
  }

  onClientRequestError(err) {
    this.setState({
      serverError: err,
    });
  }

  // TODO: Make sure "this" player is first. Flexbox Order?
  renderHands() {
    if (!this.state.players) {
      return;
    }
    const hands = Object.values(this.state.players)
      .map((player) => this.renderHand(player));
    return (hands)
  }

  renderHand(player) {
    return <Player
      isMyHand={player.id === this.state.playerID}
      key={player.id}
      player={player}
      width={theme.board.width}
      handlePurchaseCard={this.onPurchaseReservedCard}
      isPlayerTurn={this.state.isPlayerTurn}
    />
  }

  onPurchaseReservedCard(card) {
    this.setState({
      actionData: card.id,
      actionType: ActionType.PURCHASE_RESERVED_CARD,
    }, this.onEndTurn)
  }

  onPurchaseTokens(tokensTaken, tokensReturned) {
    const tokens = new Map()
    tokensTaken.forEach((amount, gemStone) => {
      tokens.set(gemStone, amount);
    })
    tokensReturned.forEach((amount, gemStone) => {
      if(tokens.has(gemStone)) {
        tokens.set(gemStone, tokens.get(gemStone)-amount)
      } else {
        tokens.set(gemStone, -1*amount)
      }
    })
    const tokenObject = Array.from(tokens.keys())
      .reduce((acc, gemStone) => {
        acc[gemStone] = tokens.get(gemStone)
        return acc;
      }, {})
    this.setState({
      actionData: tokenObject,
      actionType: ActionType.TAKE_GEMS,
    }, this.onEndTurn)
  }

  onPurchaseActiveCard(card) {
    this.setState({
      actionData: card.id,
      actionType: ActionType.PURCHASE_ACTIVE_CARD,
    }, this.onEndTurn)
  }

  onReserveActiveCard(card) {
    this.setState({
      actionData: card.id,
      actionType: ActionType.RESERVE_ACTIVE_CARD,
    }, this.onEndTurn)
  }

  onReserveTierCard(tier) {
    this.setState({
      actionData: tier,
      actionType: ActionType.RESERVE_DECK_CARD,
    }, this.onEndTurn)
  }

  onHackNobles() {
    this.setState({
      actionData: {},
      actionType: "hackForNobles"
    }, this.onEndTurn)
  }

  onEndTurn() {
    const actions = {[this.state.actionType]: this.state.actionData}
    this.socket.emit("EndTurn", {
      actions: actions,
      gameID: this.state.gameID,
      playerID: this.state.playerID,
    })
  }

  render() {
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <p>Invalid Input: {this.state.invalidInputError}</p>
        : null
    );
    const ServerError = () => (
      (this.state.serverError && !this.state.invalidInputError)
        ? <p>Server Error: {this.state.serverError.message}</p>
        : null
    );

    const Turn = () => (this.state.isPlayerTurn
      ? <h2>It is <TurnName>your</TurnName> turn!</h2>
      : <h2>It is <TurnName>{this.state.players[this.state.turnOrder[this.state.curTurnIndex]]?.user?.name}'s</TurnName> turn</h2>
    );

    const Winner = () => (this.state.winner.id === this.state.playerID
      ? <WinnerScreen><h1>Congratulations <TurnName>you</TurnName> win!</h1></WinnerScreen>
      : <WinnerScreen><h1><TurnName>{this.state.winner.user.name}</TurnName> has won with ${this.state.winner.hand.score} points</h1></WinnerScreen>
    );

    return (
      <GameContainer>
        <Scorebox>
          <TargetScore>TargetScore: <b>{this.state.targetScore}</b></TargetScore>
          <p>Turn: {this.state.gameTurn}</p>
          <Turn />
          {this.state.winner && !this.state.tieBreakerMoreRounds
          /*{ {!this.state.tieBreakerMoreRounds }*/
            ? <Winner/>
            : null
          }
        </Scorebox>
        <Board
          board={this.state.board}
          hand={this.state.player?.hand}
          isPlayerTurn={this.state.isPlayerTurn}
          onPurchaseCard={this.onPurchaseActiveCard}
          onPurchaseTokens={this.onPurchaseTokens}
          onReserveCard={this.onReserveActiveCard}
          onReserveTierCard={this.onReserveTierCard}
        />
        {this.renderHands()}
        <InvalidInputError />
        <ServerError />
        <Button onClick={this.onHackNobles}>Hack Nobles</Button>

      </GameContainer>
    )
  }
}

export default Game;
