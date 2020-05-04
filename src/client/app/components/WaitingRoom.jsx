import React from 'react';
import Button from '../styledcomponents/button.jsx'
import FilledButton from '../styledcomponents/filled-button.jsx'
import styled from "styled-components";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { deserialize } from 'bson';
import { socket } from '../socket';
import theme from '../styledcomponents/theme.jsx'

const AtLeastTwoPlayerError = 'Need atleast 2 players to start a game'
const AtMostFourPlayerError = 'You may only start a game with at most 4 players'
const AllPlayersNotReadyError = 'All players must be ready'

const WaitingRoomContainer = styled.div`
  margin-top: 10rem;
  margin-bottom: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  text-align: center;
`
const PlayerTableContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`
const ClipBoard = styled.span`
  margin-left: 0.5rem;
`
const CopiedCode = styled.p`
  color: ${ props => props.theme.color.secondary };
`
const Ready = styled.span`
  color: ${ props => props.isready
    ? props.theme.color.primary
    : props.theme.color.error};
`
const Host = styled.span`
  color: ${ props => props.theme.color.secondary };
`
const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 28rem;
`
const Row = styled.div`
  margin: 0.5rem 0;
  display: flex;
  justify-content: space-evenly;
`
const Header = styled(Row)`
  margin: 0.5rem 0;
  text-decoration: underline;
`
const Col = styled.div`
  justify-content: center;
  width: 4rem;
`
const NameCol = styled(Col)`
  width: 20rem;
`
const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`

const CopiedCodeDialog = function () {
  return (<CopiedCode>Copied to clipboard!</CopiedCode>)
}

class WaitingRoom extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      copiedCode: false,
      invalidInputError: null,
      player: {},
      playerID: this.props.playerID,
      players: [{}],
      roomCode: this.props.roomCode,
      serverError: null,
    }

    this.socket = socket;
    this.areAllPlayersReady = this.areAllPlayersReady.bind(this);
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
      invalidInputError: null,
      serverError: null,
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
          <NameCol>Name</NameCol>
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
        <NameCol>{player.user.name}</NameCol>
        <Col>{isReady}</Col>
      </Row>
    )
  }

  onReady() {
    this.socket.emit('PlayerReady', {
      roomCode: this.state.roomCode,
      playerID: this.state.playerID,
      isPlayerReady: true,
    });
  }

  onUnReady() {
    this.socket.emit('PlayerReady', {
      roomCode: this.state.roomCode,
      playerID: this.state.playerID,
      isPlayerReady: false,
    });
  }

  onStartGame() {
    let message;
    const areAllPlayersReady = this.areAllPlayersReady();

    if (this.state.players.size < 2) {
      message = AtLeastTwoPlayerError
    } else if (this.state.players.size > 4) {
      message = AtMostFourPlayerError
    } else if (!areAllPlayersReady) {
      message = AllPlayersNotReadyError
    } else {
      message = null
    }
    this.setState({
      invalidInputError: message,
    })

    if (message || this.state.invalidInputError) {
      return;
    }
    this.socket.emit('StartNewGame', this.state.roomCode);
  }

  renderPlayerButton() {
    if (!this.state.player) {
      return;
    }

    const button = this.state.player.isHost
      ? (<Button onClick={this.onStartGame}>
        Start Game
      </Button>)
      : this.state.player.isReady
        ? (<FilledButton onClick={this.onUnReady}>Ready</FilledButton>)
        : (<Button onClick={this.onReady}>Ready</Button>)
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

  onLeaveRoom() {
    this.socket.emit('LeftRoom', {
      roomCode: this.state.roomCode,
      playerID: this.state.playerID,
    });
    this.props.history.push('/')
  }

  render() {
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <ErrorMessage>{this.state.invalidInputError}</ErrorMessage>
        : null
    );
    const ServerError = () => (
      (this.state.serverError && !this.state.invalidInputError)
        ? <ErrorMessage>{this.state.serverError.message}</ErrorMessage>
        : null
    );

    return (
      <WaitingRoomContainer>
        <div>
          <p>Room Code</p>
          <CopyToClipboard text={this.state.roomCode} onCopy={this.onCopyCode}>
            <Button
              color={theme.color.secondary}
              fontFamily={theme.fontFamily.secondary}>
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
        <h2>Players in Room</h2>
        <PlayerTableContainer>{this.renderPlayerTable()}</PlayerTableContainer>
        <div>
          {this.renderPlayerButton()}
        </div>
        <div>
          <Button
            color={theme.color.error}
            onClick={this.onLeaveRoom}>
            Leave Room
          </Button>
        </div>
        <InvalidInputError />
        <ServerError />
      </WaitingRoomContainer>
    );
  }
}

export default WaitingRoom;
