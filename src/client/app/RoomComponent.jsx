
import React from 'react';
import Button from 'react-bootstrap/Button';
import { socket } from './socket';

class RoomComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerID: '',
      roomCode: '',
      playersInfo: {},
      player: {},
    }
    this.socket = socket;
    this.onRoomUpdate = this.onRoomUpdate.bind(this);
    this.setClientPlayerID = this.setClientPlayerID.bind(this);
  }

  componentDidMount() {
    this.socket.on('joinedRoom', this.onRoomUpdate);
    this.socket.on('clientPlayerID', this.setClientPlayerID);
  }

  onRoomUpdate({room, players}) {
    console.log(players)
    const playersInfo = new Map();
    players.forEach((someone) => {
      playersInfo.set(someone.id, someone);
    })

    const currentPlayer = playersInfo.get(this.state.playerID)
    console.log("client: ", currentPlayer);

    this.setState({
      roomCode: room.code,
      // playersInfo: playersInfo,
      // player: currentPlayer,
    });
  }

  setClientPlayerID(playerID) {
    console.log(playerID);
    this.setState({
      playerID: playerID,
    });
  }

  render() {
    return (
      <div>
        <p>Room Code</p>
        <Button variant="outline-dark">{this.state.roomCode}</Button>
        <p>PlayerID: {this.state.playerID}</p>
      </div>
    );
  }
}

export default RoomComponent;
