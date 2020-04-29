import React from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
// import CardComponent from './CardComponent.jsx';
// import TierCardComponent from './TierCardComponent.jsx';
// import NobleComponent from './NobleComponent.jsx';
// import GemStoneTokenComponent from './GemStoneTokenComponent.jsx';
import { socket } from '../socket';
// import { GemStone, CardGemStone } from '../enums/gemstones.js';
// import { CardTier } from '../enums/cardtier.js';

// TODO: Remove after testing.
// const myCard = {
//   tier: CardTier.TIER3,
//   pointValue: 3,
//   gemStoneType: CardGemStone.SAPPHIRE,
//   requiredGemStones: new Map([
//     [GemStone.EMERALD, 3],
//     [GemStone.RUBY, 4],
//     [GemStone.DIAMOND, 1],
//     [GemStone.CHOCOLATE, 2],
//   ])
// }

// const myNoble = {
//   pointValue: 3,
//   requiredCards: new Map([
//     [CardGemStone.DIAMOND, 3],
//     [CardGemStone.RUBY, 3],
//     [CardGemStone.CHOCOLATE, 3],
//   ])
// }

class WaitingRoom extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userName: '',
      roomCode: '',
      errorMessage: null,
    }
    this.socket = socket;
    this.onAllowNavigateToRoom = this.onAllowNavigateToRoom.bind(this)
    this.onClientRequestError = this.onClientRequestError.bind(this)
    this.onFormChange = this.onFormChange.bind(this)
    this.onCreateRoom = this.onCreateRoom.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
  }

  componentDidMount() {
    this.socket.on('allowNavigateToRoom', this.onAllowNavigateToRoom);
    this.socket.on('ClientRequestError', this.onClientRequestError);
  }

  componentWillUnmount() {
    this.socket.off('allowNavigateToRoom', this.onAllowNavigateToRoom);
    this.socket.off('ClientRequestError', this.onClientRequestError);
  }

  onAllowNavigateToRoom(data) {
    this.props.history.push('/room', data);
  }

  onClientRequestError(err) {
    this.setState({
      errorMessage: err,
    });
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
    this.socket.emit('createNewRoom', this.state.userName);
  }

  onJoinRoom() {
    this.socket.emit('joinRoom', { userName: this.state.userName, roomCode: this.state.roomCode })
  }

  render() {
    const ErrorMessage = () => (this.state.errorMessage
      ? <div>{this.state.errorMessage.name}: {this.state.errorMessage.message}</div>
      : null
    );

    return (
      <div>
        <h1>Welcome to Splendor Online</h1>
        <h2>A resource-based card-building game</h2>
        <img></img>
        <Form>
          <Form.Group>
            <Form.Label>Enter a name</Form.Label>
            <FormControl type="text" placeholder="Ex. NormalHuman11" name="userName" onChange={this.onFormChange} value={this.state.userName} />
            <Button variant="success" onClick={this.onCreateRoom}>Create Game</Button>
          </Form.Group>
          <Form.Group>
            <Form.Label><p> Room Code </p></Form.Label>
            <FormControl type="text" placeholder="Ex. AB3D" name="roomCode" onChange={this.onFormChange} value={this.state.roomCode} />
            <Button variant="success" onClick={this.onJoinRoom}>Join Game</Button>
          </Form.Group>
        </Form>
        <ErrorMessage/>
        {/* <CardComponent card={myCard} fill="true"/>
        <TierCardComponent tier={myCard.tier}/>
        <GemStoneTokenComponent type={GemStone.GOLD}/>
        <NobleComponent noble={myNoble}/> */}
      </div>
    );
  }
}

export default WaitingRoom;
