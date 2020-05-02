import React from 'react'
import styled from "styled-components"
import Button from '../styledcomponents/button.jsx'
import GemStoneToken from './GemStoneToken.jsx'
import theme from '../styledcomponents/theme.jsx'

const TokenModalContainer = styled.div`
  padding: 2rem;
  background-color: ${ props => props.theme.color.white};
`

class TokenModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      availableGemStones: this.props.availableGemStones,
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: this.props.playerGemStones,
    }
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.availableGemStones !== prevProps.availableGemStones) {
      this.setState({
        availableGemStones: this.props.availableGemStones,
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: this.props.playerGemStones,
      })
    }
  }

  renderGemStoneTokens(tokens) {
    if (!tokens) {
      return;
    }
    return Object.keys(tokens)
      .map((gemstone) => this.renderGemStoneToken(gemstone, tokens[gemstone]))
  }

  renderGemStoneToken(gemStone, amount) {
    return (<div key={gemStone}>
      <GemStoneToken
        type={gemStone}
        amount={amount}
        width={theme.token.modal.width}
        height={theme.token.modal.height}
      />
    </div>)
  }

  render() {
    return (
      <TokenModalContainer>
        <p>Available: </p>
        <div>{this.renderGemStoneTokens(this.state.availableGemStones)}</div>
        <p>Yours: </p>
        <div>{this.renderGemStoneTokens(this.state.playerGemStones)}</div>
      </TokenModalContainer>
    )
  }
}

export default TokenModal;
