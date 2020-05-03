import React from 'react'
import styled from "styled-components"
import Button from '../styledcomponents/button.jsx'
import Card from './Card.jsx'
import theme from '../styledcomponents/theme.jsx'
import GemStoneToken from './GemStoneToken.jsx'
import { GemStone } from '../enums/gemstones.js'

const CardModalContainer = styled.div`
  max-width: ${ props => `${props.width}rem`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${ props => props.theme.color.white};
`
const TokensOwned = styled.div`
  margin: 1rem 0;
  text-decoration: underline;
  color: ${ props => props.theme.color.secondary};
`
const InvalidInput = styled.p`
  padding: 1rem;
  color: ${ props => props.theme.color.error};
  text-align: left;
`
const Row = styled.div`
  margin: 0.5rem 0rem;
  display: flex;
  justify-content: center;
`
const Col = styled.div`
  margin: 0rem 0.5rem;
`

class CardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      card: this.props.card,
      invalidInputError: null,
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: new Map(Object.entries(this.props.playerGemStones)),
      playerReservedCards: this.props.playerReservedCards,
    }
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReserveCard = this.onReserveCard.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.card !== prevProps.card ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn) {
      this.setState({
        card: this.props.card,
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: new Map(Object.entries(this.props.playerGemStones)),
        playerReservedCards: this.props.playerReservedCards,
      })
    }
  }

  renderGemStoneTokens() {
    if (!this.state.playerGemStones) {
      return
    }
    return (
      <Row>
        {
          Array.from(this.state.playerGemStones.keys())
            .map((gemstone) => this.renderGemStoneToken(gemstone, this.state.playerGemStones.get(gemstone)))
        }
      </Row>
    )
  }

  renderGemStoneToken(gemStone, amount) {
    return (
      <Col key={gemStone}>
        <GemStoneToken
          type={gemStone}
          amount={amount}
          width={theme.token.modal.width}
          height={theme.token.modal.height}
        />
      </Col>)
  }

  onPurchaseCard() {
    const requiredGemStones = new Map(Object.entries(this.state.card.requiredGemStones))
    let goldLeft = this.state.playerGemStones.get(GemStone.GOLD)
    const canPurchaseCard = Array.from(requiredGemStones.keys())
      .map((gemStone) => {
        const have = this.state.playerGemStones.get(gemStone)
        const need = requiredGemStones.get(gemStone)
        if (have >= need) {
          return true
        }
        if (goldLeft > 0 && have + goldLeft >= need) {
          goldLeft -= (need - have)
          return true;
        }
        return false;
      }).reduce((prev, cur) => prev && cur)
    if (!canPurchaseCard) {
      this.setState({
        invalidInputError: `Not sufficient gems to purchase card`
      })
      return;
    }
    this.props.handlePurchaseCard()
  }

  onReserveCard() {
    if(Object.keys(this.state.playerReservedCards).length >= 3) {
      this.setState({
        invalidInputError: `Unable to reserve. You may only have 3 reserved cards.`
      })
      return;
    }
    this.props.handleReserveCard()
  }

  render() {
    if (!this.state.card) {
      return <div></div>;
    }
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <InvalidInput>Invalid Input: {this.state.invalidInputError}</InvalidInput>
        : null
    );

    return (
      <CardModalContainer width={this.props.width}>
        <Card card={this.state.card} width={theme.card.modal.width} height={theme.card.modal.height} />
        <TokensOwned>
          <p>Owned Gemstones</p>
          {this.renderGemStoneTokens()}
        </TokensOwned>
        {this.state.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.primary}
              onClick={this.onPurchaseCard}>
              Purchase Card
          </Button>
          </div>
          : null
        }
        {this.state.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.onReserveCard}>
              Reserve Card
          </Button>
          </div>
          : null
        }
        <div>
          <Button
            color={theme.color.error}
            onClick={this.props.handleClose}>
            Close
          </Button>
        </div>
        <InvalidInputError />
      </CardModalContainer>)
  }
}

export default CardModal;
