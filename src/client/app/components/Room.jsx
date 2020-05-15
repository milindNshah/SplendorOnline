import React from 'react'
import styled from 'styled-components'
import { ThemeProvider } from 'styled-components'
import Button from '../styledcomponents/button.jsx'
import Input from '../styledcomponents/input.jsx'
import theme from '../styledcomponents/theme.jsx'
import Game from './Game.jsx';
import WaitingRoom from './WaitingRoom.jsx';
import { socket } from '../socket'

const UserNameError = 'User name must be between 1 and 25 characters and may only contain alphanumeric characters'
const RoomCodeError = 'Room Code must be a 4 character alphanumeric code'

const RoomContainer = styled.div`
  margin-top: 10vh;
  margin-bottom: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  text-align: center;
`
const Form = styled.form`
  margin: 0rem;
`
const Label = styled.div`
  margin: 0.5rem 0;
`
const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`

class Room extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      invalidInputError: null,
      isJoinRoom: this.props.location?.state?.isJoinRoom,
      isCreateRoom: this.props.location?.state?.isCreateRoom,
      gameID: null,
      gameStarted: false,
      loadWaitingRoom: false,
      playerID: null,
      roomCode: null,
      roomCodeInput: '',
      serverError: null,
      userNameInput: '',
    }
    this.socket = socket
    this.onClientRequestError = this.onClientRequestError.bind(this)
    this.onCreateRoom = this.onCreateRoom.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
    this.onLeaveRoom = this.onLeaveRoom.bind(this)
    this.onGameStart = this.onGameStart.bind(this)
    this.onLoadWaitingRoom = this.onLoadWaitingRoom.bind(this)
    this.renderCreateRoom = this.renderCreateRoom.bind(this)
    this.renderJoinRoom = this.renderJoinRoom.bind(this)
  }

  componentDidMount() {
    let codeValue = null;
    if(this.props.location.search.length !== 0) {
      const splitIndex = this.props.location?.search.indexOf("?code=")+6;
      if(splitIndex > -1) {
        codeValue = this.props.location?.search.slice(splitIndex);
        if (codeValue && codeValue.length !== 0) {
          this.setState({
            isJoinRoom: true,
            roomCodeInput: codeValue,
          })
        }
      }
    }

    if(!codeValue && !this.props.location.state) {
      this.props.history.push('/');
    }
    this.socket.on('ClientRequestError', this.onClientRequestError);
    this.socket.on('LoadWaitingRoom', this.onLoadWaitingRoom);
    this.socket.on('GameStarted', this.onGameStart);
  }

  componentWillUnmount() {
    this.socket.off('ClientRequestError', this.onClientRequestError);
    this.socket.off('LoadWaitingRoom', this.onLoadWaitingRoom);
    this.socket.off('GameStarted', this.onGameStart);
  }

  onClientRequestError(err) {
    this.setState({
      serverError: err,
    })
  }

  onLoadWaitingRoom(data) {
    this.setState({
      loadWaitingRoom: true,
      playerID: data.playerID,
      roomCode: data.roomCode,
    })
  }

  onGameStart(data) {
    this.setState({
      gameStarted: true,
      gameID: data.gameID,
    })
  }

  onCreateRoom(e) {
    e.preventDefault()
    if (!this.checkUserNameIsValid(this.state.userNameInput)) {
      this.setState({ invalidInputError: UserNameError })
      return;
    }
    this.socket.emit('CreateNewRoom', this.state.userNameInput);
  }

  onJoinRoom(e) {
    e.preventDefault()
    if (!this.checkUserNameIsValid(this.state.userNameInput)) {
      this.setState({ invalidInputError: UserNameError })
      return;
    }
    if (!this.checkRoomCodeIsValid(this.state.roomCodeInput)) {
      this.setState({ invalidInputError: RoomCodeError })
      return;
    }
    this.socket.emit('JoinRoom', { userName: this.state.userNameInput.trim(), roomCode: this.state.roomCodeInput.trim() })
  }

  checkUserNameIsValid(newUserName) {
    const regex = /^[a-zA-Z0-9]{1,25}$/g;
    return newUserName.trim().match(regex);
  }

  checkRoomCodeIsValid(newRoomCode) {
    const regex = /^[a-zA-Z0-9]{4}$/g
    return newRoomCode.trim().match(regex);
  }

  onFormChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    let invalidInputError = null;
    if (name === 'userNameInput') {
      if (!this.checkUserNameIsValid(value)) {
        target.setCustomValidity('User Name');
        invalidInputError = UserNameError;
      } else {
        target.setCustomValidity('');
      }
    }
    if (name === 'roomCodeInput') {
      if (!this.checkRoomCodeIsValid(value)) {
        target.setCustomValidity('Room Code');
        invalidInputError = RoomCodeError
      } else {
        target.setCustomValidity('');
      }
    }

    this.setState({
      invalidInputError: invalidInputError,
      serverError: null,
      [name]: value
    });
  }

  renderCreateRoom() {
    return (
      <Form noValidate onSubmit={this.onCreateRoom}>
        <Label>Enter your username</Label>
        <div>
          <Input
            type="text"
            name="userNameInput"
            onChange={this.onFormChange}
            value={this.state.userNameInput}
          />
        </div>
        <div>
          <Button
            type="button"
            disabled={this.state.invalidInputError}
            onClick={this.onCreateRoom}>
            Create Game
          </Button>
        </div>
      </Form>
    )
  }

  renderJoinRoom() {
    return (
      <Form noValidate onSubmit={this.onJoinRoom}>
        <Label>Enter your username</Label>
        <div>
          <Input
            type="text"
            name="userNameInput"
            onChange={this.onFormChange}
            value={this.state.userNameInput}
          />
        </div>
        <Label>Enter the room code</Label>
        <div>
          <Input
            type="text"
            name="roomCodeInput"
            onChange={this.onFormChange}
            value={this.state.roomCodeInput}
          />
        </div>
        <div><Button
          type="button"
          color={theme.color.secondary}
          disabled={this.state.invalidInputError}
          onClick={this.onJoinRoom}>
          Join Game
        </Button></div>
      </Form>
    )
  }

  onLeaveRoom() {
    this.props.history.push('/');
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
      <ThemeProvider theme={theme}>
        {this.state.gameStarted
          ? <Game {...this.props} gameID={this.state.gameID} playerID={this.state.playerID} />
          : this.state.loadWaitingRoom
            ? <WaitingRoom {...this.props} roomCode={this.state.roomCode} playerID={this.state.playerID} />
            : <RoomContainer>
              {this.state.isJoinRoom ? this.renderJoinRoom() : null}
              {this.state.isCreateRoom ? this.renderCreateRoom() : null}
              <Button
                color={theme.color.error}
                onClick={this.onLeaveRoom}>
                Leave Room
              </Button>
              <InvalidInputError />
              <ServerError />
            </RoomContainer>
        }
      </ThemeProvider>
    )
  }
}

export default Room;
