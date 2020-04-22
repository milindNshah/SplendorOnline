
import React from 'react';
import Button from 'react-bootstrap/Button';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { socket } from './socket';

class RoomComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      copiedCode: false,
      playerID: '',
      roomCode: '',
      playersInfo: [{}],
      player: {},
    }
    this.socket = socket;
    this.onRoomUpdate = this.onRoomUpdate.bind(this);
    this.setClientPlayerID = this.setClientPlayerID.bind(this);
    this.renderPlayerTable = this.renderPlayerTable.bind(this);
    this.createPlayerRow = this.createPlayerRow.bind(this);
    this.onCopyCode = this.onCopyCode.bind(this);
  }

  componentDidMount() {
    this.socket.on('updateRoom', this.onRoomUpdate);
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

  onCopyCode() {
    this.setState({
      copiedCode: true,
    });
    const timer = setTimeout(() => {
      this.setState({
        copiedCode: false,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }

  setClientPlayerID(playerID) {
    this.setState({
      playerID: playerID,
    });
  }

  renderPlayerTable() {
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

    const isHost = player.isHost
      ? (<span><i className="fa fa-circle"></i></span>)
      : (<span></span>)

    return (
      <div className="row" key={player.id}>
        <div className="col">{isHost}</div>
        <div className="col">{player.user.name}</div>
        <div className="col">{isReady}</div>
      </div>
    )
  }

  render() {
    const CopiedCodeDialog = () => (<div>Copied to clipboard!</div>)

    return (
      <div>
        <div>
          <p>Room Code</p>
          <CopyToClipboard text={this.state.roomCode} onCopy={this.onCopyCode}>
            <Button variant="outline-dark">{this.state.roomCode}</Button>
          </CopyToClipboard>
          {
            this.state.copiedCode
              ? <CopiedCodeDialog/>
              : null
          }
          <p>PlayerID: {this.state.playerID}</p>
        </div>
        <div>
          <h1>Player Info</h1>
          {this.renderPlayerTable()}
        </div>
      </div>
    );
  }
}

export default RoomComponent;
