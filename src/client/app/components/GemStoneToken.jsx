import React from 'react'
import styled from 'styled-components'
import { GemStoneBase } from './GemStone.jsx'
import { getColorFromGemStone } from '../enums/gemstones.js'

const TokenContainer = styled.div`
  position: relative;
  /* width: 60px;
  height: 60px; */
`;

const Amount = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: ${ props => props.fontSize || "2rem" };
  font-family: "Roboto Slab";
  color: ${ props => props.type ? getColorFromGemStone(props.type) : "white" };
  text-shadow: -1px 1px 0 black,
				  1px 1px 0 black,
				  1px -1px 0 black,
				  -1px -1px 0 black;
  -webkit-font-smoothing: antialiased;
`

const Token = styled.div`
  background: black;
  /* From CardComponent.jsx */
  width: 75px;
  height: 75px;
  box-shadow: inset 0px 0px 0px 2px ${ props => props.type ? getColorFromGemStone(props.type) : "white"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

class GemStoneToken extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TokenContainer>
        <Amount>{this.props.amount}</Amount>
        <Token type={this.props.type}>
          <GemStoneBase type={this.props.type} width='2rem' height='2rem' fill="true"/>
        </Token>
      </TokenContainer>
    );
  }
}

export default GemStoneToken;
