import React from 'react';
import GameComponent from './GameComponent.jsx';
import RoomComponent from './RoomComponent.jsx';
import { socket } from './socket';

class RoomGameComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gameStarted: false,
      gameID: '',
      playerID: this.props.location.state
        ? this.props.location.state.playerID
        : '',
      roomCode: this.props.location.state
        ? this.props.location.state.roomCode
        : '',
    }
    this.socket = socket;
    this.onGameStart = this.onGameStart.bind(this);
  }

  componentDidMount() {
    this.socket.on('gameStarted', this.onGameStart);
  }

  componentWillUnmount() {
    this.socket.off('gameStarted', this.onGameStart);
  }

  onGameStart(data) {
    this.setState({
      gameStarted: true,
      gameID: data.gameID,
    })
  }

  render() {
    return (
      <div>
        {this.state.gameStarted
          ? <GameComponent {...this.props} gameID={this.state.gameID} playerID={this.state.playerID} />
          : <RoomComponent {...this.props} roomCode={this.state.roomCode} playerID={this.state.playerID} />
        }
      </div>
    )
  }
}

export default RoomGameComponent;
