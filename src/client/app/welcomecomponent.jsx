import React from 'react';
import Button from 'react-bootstrap/Button';

class WelcomeComponent extends React.Component {

  render() {
    return (
      <div>
        <h1>Welcome to Splendor</h1>
        <h2>Subtitle here</h2>
        <img></img>
        <Button variant="success">Create Game</Button>
        <Button variant="success">Join Game</Button>
      </div>
    );
  }

}

export default WelcomeComponent;
