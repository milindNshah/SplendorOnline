import React from 'react'
import styled from 'styled-components'
import theme from '../styledcomponents/theme.jsx'
import { GemStoneBase } from './GemStone.jsx'
import { getColorFromGemStone } from '../enums/gemstones.js'

const TokenContainer = styled.div`
  position: relative;
`

const Amount = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: ${ props => props.fontSize ?? props.theme.token.fontSize};
  font-family: ${ props => props.theme.fontFamily.secondary };
  color: ${ props => getColorFromGemStone(props.type) ?? props.theme.color.white };
  text-shadow: -1px 1px 0 black,
				  1px 1px 0 black,
				  1px -1px 0 black,
				  -1px -1px 0 black;
`

const Token = styled.div`
  background: ${ props => props.theme.color.black };
  width: ${ props => props.theme.token.width };
  height: ${ props => props.theme.token.height };
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
      <TokenContainer>
        <Amount>{this.props.amount}</Amount>
        <Token type={this.props.type}>
          <GemStoneBase
            type={this.props.type}
            width={theme.token.gemStone.width}
            height={theme.token.gemStone.height}
            fill="true"
          />
        </Token>
      </TokenContainer>
    );
  }
}

export default GemStoneToken;
