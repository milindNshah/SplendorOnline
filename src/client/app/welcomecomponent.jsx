import React from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { socket } from './socket';

class WelcomeComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userName: '',
      roomCode: '',
    }
    this.onFormChange = this.onFormChange.bind(this)
    this.onCreateRoom = this.onCreateRoom.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
  }

  onFormChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  onCreateRoom() {
    socket.emit('createNewRoom', this.state.userName);
  }

  onJoinRoom() {
    socket.emit('joinRoom', { userName: this.state.userName, roomCode: this.state.roomCode })
  }

  render() {
    return (
      <div>
        <h1>Welcome to Splendor</h1>
        <h2>A resource-based card-building game</h2>
        <img></img>
        <Form>
          <Form.Group>
            <Form.Label>Enter a name</Form.Label>
            <FormControl type="text" placeholder="Ex. NormalHuman11" name="userName" onChange={this.onFormChange} value={this.state.userName} />
            <Button variant="success"><Link to="/room" onClick={this.onCreateRoom}>Create Game</Link></Button>
          </Form.Group>
          <Form.Group>
            <Form.Label><p> Room Code </p></Form.Label>
            <FormControl type="text" placeholder="Ex. AB3D" name="roomCode" onChange={this.onFormChange} value={this.state.roomCode} />
            <Button variant="success"><Link to="/room" onClick={this.onJoinRoom}>Join Game</Link></Button>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default WelcomeComponent;
