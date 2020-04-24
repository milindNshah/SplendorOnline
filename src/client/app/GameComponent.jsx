import React from 'react';
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
    }
    this.socket = socket;
    this.onGameUpdate = this.onGameUpdate.bind(this);
    this.onClientRequestError = this.onClientRequestError.bind(this);
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
    const currentPlayer = players.get(this.state.playerID);

    this.setState({
      players: players,
      player: currentPlayer,
    });
  }

  onClientRequestError(err) {
    this.setState({
      errorMessage: err,
    });
  }

  render() {
    const ErrorMessage = () => (this.state.errorMessage
      ? <div>{this.state.errorMessage.name}: {this.state.errorMessage.message}</div>
      : null
    );

    return (
      <div>
        <h1>This is the Game Component</h1>
        <p>GameID: {this.state.gameID}</p>
        <p>PlayerID: {this.state.playerID}</p>
        <ErrorMessage/>
      </div>
    )
  }
}

export default GameComponent;
