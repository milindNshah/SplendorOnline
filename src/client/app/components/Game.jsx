import React from 'react';
import styled from 'styled-components'
import Button from '../styledcomponents/button.jsx'
import Board from './Board.jsx';
import Hand from './Hand.jsx';
import { deserialize } from 'bson';
import { socket } from '../socket';
import { ActionType } from '../enums/actiontype';

const GameContainer = styled.div`
  margin-top: 2.5rem;
  text-align: center;
`
const Scorebox = styled.div`
  margin-bottom: 3rem;
`
const TargetScore = styled.h2`
  color: ${ props => props.theme.color.error };
`
const TurnName = styled.span`
  color: ${ props => props.theme.color.secondary};
  font-weight: bold;
`

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      board: {},
      curPlayerTurn: {},
      curTurnIndex: 0,
      invalidInputError: null,
      serverError: null,
      gameID: this.props.gameID,
      gameTurn: 0,
      player: {},
      playerID: this.props.playerID,
      players: [{}],
      targetScore: null,
      turnOrder: [],
      winner: {},
    }
    this.socket = socket;
    this.onGameUpdate = this.onGameUpdate.bind(this);
    this.onClientRequestError = this.onClientRequestError.bind(this);
    this.onEndTurn = this.onEndTurn.bind(this);
  }

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
    const players = new Map(Object.entries(game.room.players));
    const player = players.get(this.state.playerID);
    const board = game.board;
    const curPlayerTurn = players.get(game.turnOrder[game.curTurnIndex]);

    this.setState({
      curTurnIndex: game.curTurnIndex,
      gameTurn: game.gameTurn,
      targetScore: game.targetScore,
      turnOrder: game.turnOrder,
      winner: game.winner,
      board: board,
      curPlayerTurn: curPlayerTurn,
      player: player,
      players: players,
    });
  }

  onClientRequestError(err) {
    this.setState({
      serverError: err,
    });
  }

  onEndTurn() {
    const actions = {};
    if (this.state.gemsTaken) {
      actions[ActionType.TAKE_GEMS] = this.state.gemsTaken;
    }
    if (this.state.reservedActiveCard) {
      actions[ActionType.RESERVE_ACTIVE_CARD] = this.state.reservedActiveCard.id;
    }
    if (this.state.reservedDeckCardTier) {
      actions[ActionType.RESERVE_DECK_CARD] = this.state.reservedDeckCardTier;
    }
    if (this.state.purchasedActiveCard) {
      actions[ActionType.PURCHASE_ACTIVE_CARD] = this.state.purchasedActiveCard.id;
    }
    if (this.state.purchasedReservedCard) {
      actions[ActionType.PURCHASE_RESERVED_CARD] = this.state.purchasedReservedCard.id;
    }

    this.socket.emit("endTurn", {
      actions: actions,
      gameID: this.state.gameID,
      playerID: this.state.playerID
    })

    this.setState({
      gemsTaken: null,
      reservedActiveCard: null,
      reservedDeckCardTier: null,
      purchasedActiveCard: null,
    });
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

    const Turn = () => (this.state.curPlayerTurn.id === this.state.playerID
      ? <h2>It is <TurnName>your</TurnName> turn!</h2>
      : <h2>It is <TurnName>{this.state.curPlayerTurn.user?.name}'s</TurnName> turn</h2>
    );

    return (
      <GameContainer>
        <Scorebox>
          <TargetScore>TargetScore: <b>{this.state.targetScore}</b></TargetScore>
          <p>Turn: {this.state.gameTurn}</p>
          <Turn />
        </Scorebox>
        <Board board={this.state.board} />
        <InvalidInputError />
        <ServerError />
      </GameContainer>
    )
  }
}

export default Game;
