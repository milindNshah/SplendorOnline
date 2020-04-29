import React from 'react';
// import Button from 'react-bootstrap/Button';
import Button from '../styledcomponents/button.jsx';

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.onCreateRoom = this.onCreateRoom.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
  }

  onCreateRoom() {
    this.props.history.push('/room');
  }

  onJoinRoom() {
    this.props.history.push('/room');
  }

  render() {
    return (
      <div>
        <h1>Welcome to Splendor Online</h1>
        <h2>A resource-based card-building game</h2>
        <Button
          onClick={this.onCreateRoom}
          backgroundColor={"darkseagreen"}
          color={"white"}
          borderRadius={"5px"}
        >Create Game</Button>
        {/* <Button variant="success" onClick={this.onJoinRoom}>Join Game</Button> */}
      </div>
    );
  }
}

export default Home;
