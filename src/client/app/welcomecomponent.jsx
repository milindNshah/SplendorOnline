import React from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

class WelcomeComponent extends React.Component {

  render() {
    return (
      <div>
        <h1>Welcome to Splendor</h1>
        <h2>A resource-based card-building game</h2>
        <img></img>
        <p>Enter a name</p>
        <InputGroup>
          <FormControl placeholder="Ex. NormalHuman"></FormControl>
        </InputGroup>
        <Button variant="success">Create Game</Button>
        <p> Room Code </p>
        <InputGroup>
          <FormControl placeholder="Ex. AB3D"></FormControl>
        </InputGroup>
        <Button variant="success">Join Game</Button>
      </div>
    );
  }

}

export default WelcomeComponent;
