import React from 'react';
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
          hoverColor={"#28a745"}
        >Create Game</Button>
        <Button
          onClick={this.onJoinRoom}
          hoverColor={"#17a2b8"}
        >Join Game</Button>
      </div>
    );
  }
}

export default Home;
