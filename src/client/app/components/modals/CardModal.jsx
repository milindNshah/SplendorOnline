import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import Card from '../Card.jsx'
import theme from '../../styledcomponents/theme.jsx'
import { GemStone } from '../../enums/gemstones.js'
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import GemStoneTokens from './../GemStoneTokens.jsx'

const MaxThreeReservedCardsError = `Unable to reserve. You may only have 3 reserved cards.`
const InsufficientGemsError = `Not sufficient gems to purchase card.`

const CardContainer = styled.div`
  margin-bottom: 1rem;
`
const TokensOwned = styled.div`
  margin-bottom: 1rem;
`
const TokensOwnedTitle = styled.p`
  color: ${ props => props.theme.color.black };
  text-decoration: underline;
`
const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`

class CardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      card: this.props.card,
      invalidInputError: null,
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: this.props.playerGemStones,
      playerPurchasedCards: this.props.playerPurchasedCards,
      playerReservedCards: this.props.playerReservedCards,
    }
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReserveCard = this.onReserveCard.bind(this)
    this.getPurchasedCardsByTypes = this.getPurchasedCardsByTypes.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.card !== prevProps.card ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn) {
      this.setState({
        card: this.props.card,
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: this.props.playerGemStones,
        playerPurchasedCards: this.props.playerPurchasedCards,
        playerReservedCards: this.props.playerReservedCards,
      })
    }
  }

  getPurchasedCardsByTypes() {
    const purchasedCards = new Map(Object.entries(this.state.playerPurchasedCards))
    const byType = Array.from(purchasedCards.keys())
      .reduce((map, key) => {
        const card = purchasedCards.get(key)
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
    const playerGemStones = new Map(Object.entries(this.state.playerGemStones));
    let goldLeft = playerGemStones.get(GemStone.GOLD)
    const canPurchaseCard = Array.from(requiredGemStones.keys())
      .map((gemStone) => {
        const have = playerGemStones.get(gemStone)
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
        invalidInputError: InsufficientGemsError
      })
      return;
    }
    this.props.handlePurchaseCard()
  }

  onReserveCard() {
    if(Object.keys(this.state.playerReservedCards).length >= 3) {
      this.setState({
        invalidInputError: MaxThreeReservedCardsError
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
        ? <ErrorMessage>{this.state.invalidInputError}</ErrorMessage>
        : null
    );

    return (
      <ModalContainer width={this.props.width}>
        <CardContainer>
          <Card card={this.state.card} width={theme.card.modal.width} height={theme.card.modal.height} />
        </CardContainer>
        {this.props.playerGemStones && this.props.playerPurchasedCards ?
          <TokensOwned>
            <TokensOwnedTitle>Your Tokens</TokensOwnedTitle>
            <GemStoneTokens
              gemStones={this.state.playerGemStones}
              purchasedCards={this.state.playerPurchasedCards}
              reservedCards={this.state.playerReservedCards}
              handleClick={() => {}}
              handleReservedClick={() => {}}
              handleTokenClick={() => {}}
            />
          </TokensOwned>
          : null
        }
        {this.state.isPlayerTurn && this.props.handlePurchaseCard ?
          <div>
            <Button
              color={theme.color.primary}
              onClick={this.onPurchaseCard}>
              Purchase Card
            </Button>
          </div>
          : null
        }
        {this.state.isPlayerTurn && this.props.handleReserveCard?
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
      </ModalContainer>)
  }
}

export default CardModal;
