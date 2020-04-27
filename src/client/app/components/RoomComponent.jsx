import React from 'react';
import Button from 'react-bootstrap/Button';
import { deserialize } from 'bson';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { socket } from '../socket';
import { Error } from '../enums/errors'

class RoomComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      copiedCode: false,
      playerID: this.props.playerID,
      roomCode: this.props.roomCode,
      pressedStartGame: false,
      playersInfo: [{}],
      player: {},
    }

    this.socket = socket;
    this.onRoomUpdate = this.onRoomUpdate.bind(this);
    this.onClientRequestError = this.onClientRequestError.bind(this)
    this.onLeaveRoom = this.onLeaveRoom.bind(this);
    this.renderPlayerTable = this.renderPlayerTable.bind(this);
    this.renderPlayerRow = this.renderPlayerRow.bind(this);
    this.renderPlayerButton = this.renderPlayerButton.bind(this);
    this.onCopyCode = this.onCopyCode.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onUnReady = this.onUnReady.bind(this);
    this.onStartGame = this.onStartGame.bind(this);
    this.areAllPlayersReady = this.areAllPlayersReady.bind(this);
    this.canStartGame = this.canStartGame.bind(this);
  }

  componentDidMount() {
    this.socket.on('updateRoom', this.onRoomUpdate);
    this.socket.on('ClientRequestError', this.onClientRequestError);
    this.socket.emit('requestRoomUpdate', this.state.roomCode);
  }

  componentWillUnmount() {
    this.socket.off('updateRoom', this.onRoomUpdate);
    this.socket.off('ClientRequestError', this.onClientRequestError);
  }

  onRoomUpdate(data) {
    const room = deserialize(Buffer.from(data));
    const playersInfo = new Map(Object.entries(room.players));
    const currentPlayer = playersInfo.get(this.state.playerID)
    // TODO: Eventually need to fix so that refresh actually does work.
    if(!currentPlayer) {
      this.props.history.push('/')
    }

    this.setState({
      playersInfo: playersInfo,
      player: currentPlayer,
      pressedStartGame: false,
    });
  }

  onClientRequestError(err) {
    if(err.name === Error.ROOM_DOES_NOT_EXIST) {
      this.props.history.push('/')
    }
  }

  onReady() {
    this.socket.emit('playerReady', {
      roomCode: this.state.roomCode,
      playerID: this.state.playerID,
      isPlayerReady: true,
    });
  }

  onUnReady() {
    this.socket.emit('playerReady', {
      roomCode: this.state.roomCode,
      playerID: this.state.playerID,
      isPlayerReady: false,
    });
  }

  onStartGame() {
    this.setState({
      pressedStartGame: true,
    })
    this.socket.emit('startNewGame', this.state.roomCode);
  }

  onLeaveRoom() {
    this.socket.emit('leftRoom', {
      roomCode: this.state.roomCode,
      playerID: this.state.playerID,
    });
    this.props.history.push('/')
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

  renderPlayerTable() {
    const size = this.state.playersInfo.size;
    if (size === null || size === undefined || size <= 0) {
      return;
    }

    const rows = Array.from(this.state.playersInfo.values()).map((player) => {
      return this.renderPlayerRow(player);
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

  renderPlayerRow(player) {
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

  renderPlayerButton() {
    if(!this.state.player) {
      return;
    }

    const button = this.state.player.isHost
      ? (<Button variant="primary" onClick={this.onStartGame}>Start Game</Button>)
      : this.state.player.isReady
        ? (<Button variant="primary" onClick={this.onUnReady}>Ready</Button>)
        : (<Button variant="outline-primary" onClick={this.onReady}>Ready</Button>)
    return button;
  }

  renderUnableStartGameReason() {
    if (!this.state.pressedStartGame) {
      return null;
    }
    let message;
    const areAllPlayersReady = this.areAllPlayersReady();

    if (this.state.playersInfo.size < 2) {
      message = (<div>Need atleast 2 players to start a game</div>)
    } else if (this.state.playersInfo.size > 4) {
      message = (<div>A room can only have at most 4 players</div>)
    } else if (!areAllPlayersReady) {
      message = (<div>All players must be ready</div>)
    } else {
      message = null
    }
    return message;
  }

  // Keep in sync with Room.ts->canStartGame() on Server.
  areAllPlayersReady() {
    return Array.from(this.state.playersInfo.values())
      .map((player) => {
        return player.isReady || player.isHost;
      }).reduce((acc, cur) => {
        return acc && cur
      }, true);
  }
  canStartGame() {
    const allPlayersReady = this.areAllPlayersReady()
    return allPlayersReady && this.state.playersInfo.size >= 2 && this.state.playersInfo.size <= 4;
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
              ? <CopiedCodeDialog />
              : null
          }
          <p>PlayerID: {this.state.playerID}</p>
        </div>
        <div>
          <h1>Player Info</h1>
          {this.renderPlayerTable()}
        </div>
        <div>
          {this.renderPlayerButton()}
          {this.canStartGame() ? "True" : "False"}
          {this.renderUnableStartGameReason()}
        </div>
        <div>
          <Button variant="outline-danger" onClick={this.onLeaveRoom}>Leave Room</Button>
        </div>
      </div>
    );
  }
}

export default RoomComponent;
