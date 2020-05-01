import React from 'react';
import styled from 'styled-components'
import Button from '../styledcomponents/button.jsx'
import Board from './Board.jsx';
import Player from './Player.jsx';
import { deserialize } from 'bson';
import { socket } from '../socket';

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

const Hands = styled.div`
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
      turnOrder: [],
      winner: {},
    }
    this.socket = socket;
    this.onClientRequestError = this.onClientRequestError.bind(this);
    this.onGameUpdate = this.onGameUpdate.bind(this);
    this.renderHand = this.renderHand.bind(this);
    this.renderHands = this.renderHands.bind(this);
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
    const players = game.room.players;
    const player = players[this.state.playerID];
    const board = game.board;
    const curPlayerTurn = players[game.turnOrder[game.curTurnIndex]];
    const isPlayerTurn = curPlayerTurn.id === player.id;

    this.setState({
      curTurnIndex: game.curTurnIndex,
      gameTurn: game.gameTurn,
      targetScore: game.targetScore,
      turnOrder: game.turnOrder,
      winner: game.winner,
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

  renderHands() {
    if(!this.state.players) {
      return;
    }
    const hands = Object.values(this.state.players)
      .map((player) => this.renderHand(player));
    return (<Hands>{hands}</Hands>)
  }

  // TODO: Render current player's hand first. Also why is it complaining about key.
  renderHand(player) {
    return <Player key={player.id} player={player} isPlayerTurn={this.state.isPlayerTurn}/>
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
      : <h2>It is <TurnName>{this.state.players[this.state.gameTurn[this.state.curTurnIndex]]}'s</TurnName> turn</h2>
    );

    return (
      <GameContainer>
        <Scorebox>
          <TargetScore>TargetScore: <b>{this.state.targetScore}</b></TargetScore>
          <p>Turn: {this.state.gameTurn}</p>
          <Turn />
        </Scorebox>
        <Board board={this.state.board} />
        {this.renderHands()}
        <InvalidInputError />
        <ServerError />
      </GameContainer>
    )
  }
}

export default Game;
