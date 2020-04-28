import React from 'react';
import styled from "styled-components"
import { GemStoneComponent } from './GemStoneComponent.jsx'
import { GemStone, getColorFromGemStone } from '../enums/gemstones.js';

const Token = styled.div`
  background: black;
  position: relative;
  width: 90px;
  height: 90px;
  box-shadow: inset 0px 0px 0px 2px ${ props => props.type ? getColorFromGemStone(props.type) : "white"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// const Stone = styled.div`

// `;

class GemStoneTokenComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Token type={this.props.type}>
        <GemStoneComponent type={this.props.type} width='2rem' height='2rem' fill="true"/>
      </Token>
    );
  }
}

export default GemStoneTokenComponent;
