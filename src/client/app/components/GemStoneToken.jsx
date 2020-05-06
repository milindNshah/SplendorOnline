import React from 'react'
import styled from 'styled-components'
import { GemStoneBase } from './GemStone.jsx'
import { getColorFromGemStone } from '../enums/gemstones.js'

const TokenContainer = styled.div`
  position: relative;
  cursor: ${ props => props.isClickable ? "pointer" : "default" };
`

const Amount = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: ${ props => `${props.width*2/5}rem`};
  font-family: ${ props => props.theme.fontFamily.secondary };
  color: ${ props => props.theme.color.white };
  text-shadow: -1px 1px 0 black,
				  1px 1px 0 black,
				  1px -1px 0 black,
				  -1px -1px 0 black;
`

const Token = styled.div`
  background: ${ props => props.theme.color.black };
  width: ${ props => `${props.width}rem` };
  height: ${ props => `${props.height}rem` };
  box-shadow: inset 0px 0px 0px 2px ${ props => getColorFromGemStone(props.type) ?? props.theme.color.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

class GemStoneToken extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TokenContainer {...this.props}>
        <Amount {...this.props}>{this.props.amount}</Amount>
        <Token {...this.props}>
          <GemStoneBase
            type={this.props.type}
            width={`${this.props.width*2/5}`}
            height={`${this.props.height*2/5}`}
            fill="true"
          />
        </Token>
      </TokenContainer>
    );
  }
}

export default GemStoneToken;
