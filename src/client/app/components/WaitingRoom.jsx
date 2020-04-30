import React from 'react';
import Button from '../styledcomponents/button.jsx'
import FilledButton from '../styledcomponents/filled-button.jsx'
import styled from "styled-components";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { deserialize } from 'bson';
import { socket } from '../socket';

const ClipBoard = styled.span`
  margin-left: 0.5rem;
`
const Ready = styled.span`
  color: ${ props => props.isready ? "#28a745" : "red"};
`
const Host = styled.span`
  color: #17a2b8;
`

const Table = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`
const Row = styled.div`
  padding: 0.25rem 0;
  display: flex;
`
const Header = styled(Row)`
  padding: 0.5rem 0;
`
const Col = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
`

class WaitingRoom extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      copiedCode: false,
      invalidInputError: null,
      player: {},
      playerID: this.props.playerID,
      players: [{}],
      pressedStartGame: false,
      roomCode: this.props.roomCode,
      serverError: null,
    }

    this.socket = socket;
    this.areAllPlayersReady = this.areAllPlayersReady.bind(this);
    this.canStartGame = this.canStartGame.bind(this);
    this.onClientRequestError = this.onClientRequestError.bind(this)
    this.onCopyCode = this.onCopyCode.bind(this);
    this.onLeaveRoom = this.onLeaveRoom.bind(this);
    this.onReady = this.onReady.bind(this);
    this.onRoomUpdate = this.onRoomUpdate.bind(this);
    this.onStartGame = this.onStartGame.bind(this);
    this.onUnReady = this.onUnReady.bind(this);
    this.renderPlayerTable = this.renderPlayerTable.bind(this);
    this.renderPlayerRow = this.renderPlayerRow.bind(this);
    this.renderPlayerButton = this.renderPlayerButton.bind(this);
    this.renderUnableStartGameReason = this.renderUnableStartGameReason.bind(this);
  }

  componentDidMount() {
    this.socket.emit('RequestRoomUpdate', this.state.roomCode);
    this.socket.on('ClientRequestError', this.onClientRequestError);
    this.socket.on('UpdateRoom', this.onRoomUpdate);
  }

  componentWillUnmount() {
    this.socket.off('UpdateRoom', this.onRoomUpdate);
    this.socket.off('ClientRequestError', this.onClientRequestError);
  }

  onClientRequestError(err) {
    this.setState({
      serverError: err,
    })
  }

  onRoomUpdate(data) {
    const room = deserialize(Buffer.from(data));
    const players = new Map(Object.entries(room.players));
    const currentPlayer = players.get(this.state.playerID)

    this.setState({
      players: players,
      player: currentPlayer,
      pressedStartGame: false,
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

  renderPlayerTable() {
    const size = this.state.players.size;
    if (size === null || size === undefined || size <= 0) {
      return;
    }

    const rows = Array.from(this.state.players.values()).map((player) => {
      return this.renderPlayerRow(player);
    })

    return (
      <Table>
        <Header>
          <Col>Host</Col>
          <Col>Name</Col>
          <Col>Ready</Col>
        </Header>
        {rows}
      </Table>
    );
  }

  renderPlayerRow(player) {
    const isReady = player.isReady
      ? (<Ready isready><i className="fa fa-check"></i></Ready>)
      : (<Ready><i className="fa fa-times"></i></Ready>)

    const isHost = player.isHost
      ? (<Host><i className="fa fa-circle"></i></Host>)
      : (<Host></Host>)

    return (
      <Row key={player.id}>
        <Col>{isHost}</Col>
        <Col>{player.user.name}</Col>
        <Col>{isReady}</Col>
      </Row>
    )
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

  renderPlayerButton() {
    if (!this.state.player) {
      return;
    }

    const button = this.state.player.isHost
      ? (<Button color="#28a745" onClick={this.onStartGame}>
        Start Game
      </Button>)
      : this.state.player.isReady
        ? (<FilledButton color="#28a745" onClick={this.onUnReady}>Ready</FilledButton>)
        : (<Button color="#28a745" onClick={this.onReady}>Ready</Button>)
    return button;
  }

  // Keep in sync with Room.ts->canStartGame() on Server.
  areAllPlayersReady() {
    return Array.from(this.state.players.values())
      .map((player) => {
        return player.isReady || player.isHost;
      }).reduce((acc, cur) => {
        return acc && cur
      }, true);
  }
  canStartGame() {
    const allPlayersReady = this.areAllPlayersReady()
    return allPlayersReady && this.state.players.size >= 2 && this.state.players.size <= 4;
  }

  renderUnableStartGameReason() {
    if (!this.state.pressedStartGame) {
      return null;
    }
    let message;
    const areAllPlayersReady = this.areAllPlayersReady();

    if (this.state.players.size < 2) {
      message = (<div>Need atleast 2 players to start a game</div>)
    } else if (this.state.players.size > 4) {
      message = (<div>A room can only have at most 4 players</div>)
    } else if (!areAllPlayersReady) {
      message = (<div>All players must be ready</div>)
    } else {
      message = null
    }
    this.setState({
      invalidInputError: message,
    })
  }

  onLeaveRoom() {
    this.socket.emit('leftRoom', {
      roomCode: this.state.roomCode,
      playerID: this.state.playerID,
    });
    this.props.history.push('/')
  }

  render() {
    const CopiedCodeDialog = () => (<div>Copied to clipboard!</div>)
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

    return (
      <div>
        <div>
          <p>Room Code</p>
          <CopyToClipboard text={this.state.roomCode} onCopy={this.onCopyCode}>
            <Button
              color="#17a2b8">
              {this.state.roomCode}
              <ClipBoard><i className="fa fa-clipboard"></i></ClipBoard>
            </Button>
          </CopyToClipboard>
          {
            this.state.copiedCode
              ? <CopiedCodeDialog />
              : null
          }
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
          <Button
            color="red"
            onClick={this.onLeaveRoom}>
            Leave Room
          </Button>
        </div>
        <InvalidInputError />
        <ServerError />
      </div>
    );
  }
}

export default WaitingRoom;
