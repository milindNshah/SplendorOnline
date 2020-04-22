
import React from 'react';
import {socket} from './socket';

socket.on('joinedRoom', function (room) {
  console.log("client:", room);
});

class RoomComponent extends React.Component {
  render() {
    return (
      <div><p>Room Component</p></div>
    );
  }
}

export default RoomComponent;
