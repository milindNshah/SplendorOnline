
import React from 'react';
import Button from 'react-bootstrap/Button';
import { socket } from './socket';

class RoomComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      roomCode: '',
      playersInfo: {},
      player: {},
    }
    this.socket = socket;
    this.onRoomUpdate = this.onRoomUpdate.bind(this);
  }

  componentDidMount() {
    this.socket.on('joinedRoom', this.onRoomUpdate);
  }

  onRoomUpdate(room) {
    const playersInfo = new Map();
    room.players.forEach((someone) => {
      playersInfo.set(someone.socketID, someone);
    })

    const currentPlayer = playersInfo.get(this.socket.id)
    console.log("client: ", currentPlayer);

    this.setState({
      roomCode: room.code,
      playersInfo: playersInfo,
      player: currentPlayer,
    });
  }

  render() {
    return (
      <div>
        <p>Room Code</p>
        <Button variant="outline-dark">{this.state.roomCode}</Button>
      </div>
    );
  }
}

export default RoomComponent;
