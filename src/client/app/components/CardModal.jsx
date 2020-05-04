import React from 'react'
import styled from "styled-components"
import Button from '../styledcomponents/button.jsx'
import Card from './Card.jsx'
import theme from '../styledcomponents/theme.jsx'
import GemStoneToken from './GemStoneToken.jsx'
import { GemStone, getColorFromGemStone } from '../enums/gemstones.js'
import { GemStoneBase } from './GemStone.jsx'

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
`
const TokensOwnedTitle = styled.p`
  color: ${ props => props.theme.color.secondary};
  text-decoration: underline;
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
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CardToken = styled.div`
  background: ${ props => props.theme.color.black };
  width: ${ props => `${props.width}rem` };
  height: ${ props => `${props.height}rem` };
  color: ${ props => props.theme.color.white };
  border-radius: 5px;
  border: 2px solid ${ props => getColorFromGemStone(props.type) };
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-family: ${ props => props.theme.fontFamily.secondary };
  display: flex;
  flex-direction: column;
  align-items: center;
`

class CardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      card: this.props.card,
      invalidInputError: null,
      isMyHand: this.props.isMyHand ?? true,
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: this.props.playerGemStones
        ? new Map(Object.entries(this.props.playerGemStones))
        : null,
      playerPurchasedCards: this.props.playerPurchasedCards
        ? new Map(Object.entries(this.props.playerPurchasedCards))
        : null,
      playerReservedCards: this.props.playerReservedCards,
    }
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReserveCard = this.onReserveCard.bind(this)
    this.getPurchasedCardsByTypes = this.getPurchasedCardsByTypes.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.card !== prevProps.card ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn) {
      this.setState({
        card: this.props.card,
        isMyHand: this.props.isMyHand ?? true,
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: this.props.playerGemStones
          ? new Map(Object.entries(this.props.playerGemStones))
          : null,
        playerPurchasedCards: this.props.playerPurchasedCards
          ? new Map(Object.entries(this.props.playerPurchasedCards))
          : null,
        playerReservedCards: this.props.playerReservedCards,
      })
    }
  }

  renderGemStoneTokens() {
    if (!this.state.playerGemStones || !this.state.playerPurchasedCards) {
      return
    }
    const purchasedCards = this.getPurchasedCardsByTypes();
    return (
      <Row>
        {
          Array.from(this.state.playerGemStones.keys())
            .map((gemStone) => this.renderGemStoneToken(gemStone, this.state.playerGemStones.get(gemStone), purchasedCards.get(gemStone)))
        }
      </Row>
    )
  }

  renderGemStoneToken(gemStone, amount, cards) {
    const cardAmount = cards ? cards.length : 0;

    return (
      <Col key={gemStone}>
        <GemStoneToken
          type={gemStone}
          amount={amount}
          width={theme.token.modal.width}
          height={theme.token.modal.height}
        />
        <CardToken type={gemStone} width={theme.card.token.width} height={theme.card.token.height}>
          {cardAmount}
          <GemStoneBase type={gemStone} width={theme.card.token.width*2/5} height={theme.card.token.width*2/5} fill="true"/>
        </CardToken>
      </Col>)
  }

  getPurchasedCardsByTypes() {
    const byType = Array.from(this.state.playerPurchasedCards.keys())
      .reduce((map, key) => {
        const card = this.state.playerPurchasedCards.get(key)
        let cardsForType;
        if(map.has(card.gemStoneType)) {
          cardsForType = map.get(card.gemStoneType)
          cardsForType.push(card)
        } else {
          cardsForType = []
          cardsForType.push(card)
        }
        return map.set(card.gemStoneType, cardsForType)
      }, new Map())
    return byType
  }

  onPurchaseCard() {
    const requiredGemStones = new Map(Object.entries(this.state.card.requiredGemStones))
    const getPurchasedCardsByTypes = this.getPurchasedCardsByTypes();
    let goldLeft = this.state.playerGemStones.get(GemStone.GOLD)
    const canPurchaseCard = Array.from(requiredGemStones.keys())
      .map((gemStone) => {
        const have = this.state.playerGemStones.get(gemStone)
        const need = requiredGemStones.get(gemStone)
        const purchased = getPurchasedCardsByTypes.get(gemStone)
          ? getPurchasedCardsByTypes.get(gemStone).length
          : 0
        if (have + purchased >= need) {
          return true
        } else if (goldLeft > 0 && have + purchased + goldLeft >= need) {
          goldLeft -= (need - (have + purchased))
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
        {this.props.playerGemStones && this.props.playerPurchasedCards ?
          <TokensOwned>
            <TokensOwnedTitle>Owned Gemstones</TokensOwnedTitle>
            {this.renderGemStoneTokens()}
          </TokensOwned>
          : null
        }
        {this.state.isPlayerTurn && this.state.isMyHand && this.props.handlePurchaseCard ?
          <div>
            <Button
              color={theme.color.primary}
              onClick={this.onPurchaseCard}>
              Purchase Card
            </Button>
          </div>
          : null
        }
        {this.state.isPlayerTurn && this.state.isMyHand && this.props.handleReserveCard?
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
