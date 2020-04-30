import React from 'react'
import { socket } from '../socket'
import Button from '../styledcomponents/button.jsx'
import Input from '../styledcomponents/input.jsx'

const UserNameError = 'User name cannot be empty and may only contain alphanumeric symbols'
const RoomCodeError = 'Room Code must be a 4 character alphanumeric code'

class Room extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      invalidInputError: null,
      isJoinRoom: this.props.location.state.isJoinRoom,
      isCreateRoom: this.props.location.state.isCreateRoom,
      loadWaitingRoom: false,
      userNameInput: '',
      playerID: null,
      roomCode: null,
      roomCodeInput: '',
      serverError: null,
    }
    this.socket = socket
    this.onClientRequestError = this.onClientRequestError.bind(this)
    this.onCreateRoom = this.onCreateRoom.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
    this.onLoadWaitingRoom = this.onLoadWaitingRoom.bind(this);
    this.renderJoinRoom = this.renderJoinRoom.bind(this)
    this.renderCreateRoom = this.renderCreateRoom.bind(this)
  }

  componentDidMount() {
    this.socket.on('LoadWaitingRoom', this.onLoadWaitingRoom);
    this.socket.on('ClientRequestError', this.onClientRequestError);
  }

  componentWillUnmount() {
    this.socket.off('LoadWaitingRoom', this.onLoadWaitingRoom);
    this.socket.off('ClientRequestError', this.onClientRequestError);
  }

  onLoadWaitingRoom(data) {
    this.setState({
      loadWaitingRoom: true,
      playerID: data.playerID,
      roomCode: data.roomCode,
    })
  }

  onClientRequestError(err) {
    this.setState({
      serverError: err,
    })
  }

  onCreateRoom() {
    if(!this.checkUserNameIsValid(this.state.userNameInput)) {
      this.setState({invalidInputError: UserNameError})
    }
    this.socket.emit('CreateNewRoom', this.state.userNameInput);
  }

  onJoinRoom() {
    if(!this.checkUserNameIsValid(this.state.userNameInput)) {
      this.setState({invalidInputError: UserNameError})
    }
    if(!this.checkRoomCodeIsValid(this.state.roomCodeInput)) {
      this.setState({invalidInputError: RoomCodeError})
    }
    console.log('clicked join room');
    // this.socket.emit('joinRoom', { userName: this.state.userName, roomCode: this.state.roomCode })
  }

  checkUserNameIsValid(newUserName) {
    const regex = /^[a-zA-Z0-9]+$/g;
    return newUserName.match(regex);
  }

  checkRoomCodeIsValid(newRoomCode) {
    const regex = /^[a-zA-Z0-9]{4}$/g
    return newRoomCode.match(regex);
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
      [name]: value
    });
  }

  renderCreateRoom() {
    return (
      <form noValidate>
        <label>Enter a username</label>
        <Input
          type="text"
          placeholder="Ex. NormalHuman11"
          name="userNameInput"
          onChange={this.onFormChange}
          value={this.state.userNameInput}
          hoverColor="#17a2b8"
        />
        <Button
          type="button"
          color={"#28a745"}
          disabled={this.state.invalidInputError}
          onClick={this.onCreateRoom}>
          Create Game
        </Button>
      </form>
    )
  }

  renderJoinRoom() {
    return (
      <form noValidate>
        <label>Enter a username</label>
        <Input
          type="text"
          placeholder="NormalHuman11"
          name="userNameInput"
          onChange={this.onFormChange}
          value={this.state.userName}
          hoverColor="#28a745"
        />
        <label>Enter the room code</label>
        <Input
          type="text"
          placeholder="X42L"
          name="roomCodeInput"
          onChange={this.onFormChange}
          value={this.state.roomCodeInput}
          hoverColor="#28a745"
        />
        <Button
          type="button"
          color={"#17a2b8"}
          disabled={this.state.invalidInputError}
          onClick={this.onJoinRoom}>
          Join Game
        </Button>
      </form>
    )
  }

  render() {
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <p>Invalid Input: {this.state.invalidInputError}</p>
        : null
    );
    const ServerError = () => (
      this.state.serverError
        ? <p>Server Error: {this.state.serverError}</p>
        : null
    );

    return (
      <div>
        {this.state.isJoinRoom ? this.renderJoinRoom() : null}
        {this.state.isCreateRoom ? this.renderCreateRoom() : null}
        <InvalidInputError />
        <ServerError/>
      </div>
    )
  }
}

export default Room;
