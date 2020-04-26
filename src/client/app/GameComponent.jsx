import React from 'react';
import Button from 'react-bootstrap/Button';
import { deserialize } from 'bson';
import { socket } from './socket';

class GameComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gameID: this.props.gameID,
      playerID: this.props.playerID,
      errorMessage: null,
      players: [{}],
      player: {},
      board: {},
      targetScore: this.props.targetScore,
      turnOrder: [],
      curTurnIndex: 0,
      gameTurn: 0,
      winner: {},
      curPlayerTurn: {},
    }
    this.socket = socket;
    this.onGameUpdate = this.onGameUpdate.bind(this);
    this.onClientRequestError = this.onClientRequestError.bind(this);
    this.onEndTurn = this.onEndTurn.bind(this);
  }

  componentDidMount() {
    this.socket.on('updateGame', this.onGameUpdate);
    this.socket.on('ClientRequestError', this.onClientRequestError);
    this.socket.emit('requestGameUpdate', this.state.gameID);
  }

  componentWillUnmount() {
    this.socket.off('updateGame', this.onGameUpdate);
    this.socket.off('ClientRequestError', this.onClientRequestError);
  }

  onGameUpdate(data) {
    const game = deserialize(Buffer.from(data));
    const players = new Map(Object.entries(game.room.players));
    const player = players.get(this.state.playerID);
    const board = new Map(Object.entries(game.board));
    const curPlayerTurn = players.get(game.turnOrder[game.curTurnIndex]);

    this.setState({
      turnOrder: game.turnOrder,
      curTurnIndex: game.curTurnIndex,
      gameTurn: game.gameTurn,
      winner: game.winner,
      board: board,
      players: players,
      player: player,
      curPlayerTurn: curPlayerTurn,
    });
  }

  onClientRequestError(err) {
    this.setState({
      errorMessage: err,
    });
  }

  onEndTurn() {
    this.socket.emit("endTurn", {
      gameID: this.state.gameID,
      playerID: this.state.playerID
    })
  }

  render() {
    const ErrorMessage = () => (this.state.errorMessage
      ? <div>{this.state.errorMessage.name}: {this.state.errorMessage.message}</div>
      : null
    );

    const TurnDiv = () => (this.state.curPlayerTurn.id === this.state.playerID
      ? <p>It is your turn!</p>
    : <p>It is Player {this.state.curPlayerTurn.user?.name}'s turn</p>
    );

    const EndTurnButton = () => (
      this.state.curPlayerTurn.id === this.state.playerID
    ? <Button variant="outline-primary" onClick={this.onEndTurn}>End Turn</Button>
    : <Button variant="outline-dark">Waiting for Other Players</Button>
    );

    return (
      <div>
        <h1>This is the Game Component</h1>
        <p>TargetScore: {this.state.targetScore}</p>
        <p>GameTurn: {this.state.gameTurn}</p>
        <p>Player: {this.state.player.user?.name}</p>
        <p>My Score: {this.state.player.hand?.score}</p>
        <TurnDiv/>
        <EndTurnButton/>
        <p>Winner: {this.state.winner?.user?.name}</p>
        <ErrorMessage/>
      </div>
    )
  }
}

export default GameComponent;
