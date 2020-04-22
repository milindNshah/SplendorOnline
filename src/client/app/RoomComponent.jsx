
import React from 'react';
import Button from 'react-bootstrap/Button';
import { socket } from './socket';

class RoomComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      playerID: '',
      roomCode: '',
      playersInfo: [{}],
      player: {},
    }
    this.socket = socket;
    this.onRoomUpdate = this.onRoomUpdate.bind(this);
    this.setClientPlayerID = this.setClientPlayerID.bind(this);
    this.createPlayerTable = this.createPlayerTable.bind(this);
    this.createPlayerRow = this.createPlayerRow.bind(this);
  }

  componentDidMount() {
    this.socket.on('joinedRoom', this.onRoomUpdate);
    this.socket.on('clientPlayerID', this.setClientPlayerID);
  }

  onRoomUpdate({ room, players }) {
    const playersInfo = new Map();
    players.forEach((someone) => {
      playersInfo.set(someone.id, someone);
    })
    const currentPlayer = playersInfo.get(this.state.playerID)

    this.setState({
      roomCode: room.code,
      playersInfo: playersInfo,
      player: currentPlayer,
    });
  }

  setClientPlayerID(playerID) {
    this.setState({
      playerID: playerID,
    });
  }

  createPlayerTable() {
    const size = this.state.playersInfo.size;
    if (size === null || size === undefined || size <= 0) {
      return;
    }

    const rows = Array.from(this.state.playersInfo.values()).map((player) => {
      return this.createPlayerRow(player);
    })

    return (
      <div className="container">
        <div className="row">
          <div className="col">Host</div>
          <div className="col">Name</div>
          <div className="col">Ready</div>
        </div>
        {rows}
      </div>
    );
  }

  createPlayerRow(player) {
    const isReady = player.isReady
      ? (<span><i className="fa fa-check"></i></span>)
      : (<span><i className="fa fa-times"></i></span>)

    return (
      <div className="row" key={player.id}>
        <div className="col">{player.isHost ? "True" : "False"}</div>
        <div className="col">{player.user.name}</div>
        <div className="col">{isReady}</div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div>
          <p>Room Code</p>
          <Button variant="outline-dark">{this.state.roomCode}</Button>
          <p>PlayerID: {this.state.playerID}</p>
        </div>
        <div>
          <h1>Player Info</h1>
          {this.createPlayerTable()}
        </div>
      </div>
    );
  }
}

export default RoomComponent;
