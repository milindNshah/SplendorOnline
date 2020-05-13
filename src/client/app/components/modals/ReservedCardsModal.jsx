import React from 'react'
import styled from "styled-components"
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import Button from '../../styledcomponents/button.jsx'
import Card from '../Card.jsx'
import theme from '../../styledcomponents/theme.jsx'
import GemStoneTokens from '../GemStoneTokens.jsx'
import { GemStone } from '../../enums/gemstones.js'
import { getPurchasedCardsByTypes } from '../../utils';

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
const Row = styled.div`
  margin: 1rem 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Col = styled.div`
  margin: 0rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`
const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`


class ReservedCardsModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      invalidInputError: null,
    }
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.renderCards = this.renderCards.bind(this)
  }

  // TODO: Move to utils - same as CardModal.
  onPurchaseCard(card) {
    const requiredGemStones = new Map(Object.entries(card.requiredGemStones))
    const purchasedCardsByTypes = getPurchasedCardsByTypes(this.props.purchasedCards);
    const playerGemStones = new Map(Object.entries(this.props.gemStones));
    let goldLeft = playerGemStones.get(GemStone.GOLD)
    const canPurchaseCard = Array.from(requiredGemStones.keys())
      .map((gemStone) => {
        const have = playerGemStones.get(gemStone)
        const need = requiredGemStones.get(gemStone)
        const purchased = purchasedCardsByTypes.get(gemStone)
          ? purchasedCardsByTypes.get(gemStone).length
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
    this.props.handlePurchaseCard(card)
  }

  renderCards() {
    if(!this.props.reservedCards) {
      return;
    }
    const reservedCards = new Map(Object.entries(this.props.reservedCards))
    const cards = Array.from(reservedCards.values())
      .map((card) => {
        return (
          <Col key={card.id}>
            <CardContainer>
              <Card card={card} width={theme.card.modal.width} height={theme.card.modal.height} />
            </CardContainer>
            {this.props.isMyTurn && this.props.isMyHand ?
              <div>
                <Button
                  color={theme.color.secondary}
                  onClick={() => this.onPurchaseCard(card)}>
                  Purchase Card
                </Button>
              </div>
              : null
            }
          </Col>
        )
      })
    return (<Row>
      <CardsContainer>{cards}</CardsContainer>
      {this.props.isMyHand ?
        <TokensOwned>
          <TokensOwnedTitle>Your Tokens</TokensOwnedTitle>
          <GemStoneTokens
            gemStones={this.props.gemStones}
            purchasedCards={this.props.purchasedCards}
            reservedCards={this.props.reservedCards}
            handleClick={() => { }}
            handleReservedClick={() => { }}
            handleTokenClick={() => { }}
            filterOutReservedCardToken={true}
          />
        </TokensOwned>
        : null
      }
    </Row>)
  }

  render() {
    const NoCards = () => (
      this.props.isMyHand
        ? <p>You have no reserved cards yet.</p>
        : <p>This player has no reserved cards.</p>
    )
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <ErrorMessage>{this.state.invalidInputError}</ErrorMessage>
        : null
    );

    return (
      <ModalContainer width={this.props.width}>
        {Object.keys(this.props.reservedCards).length > 0 ? this.renderCards() : <NoCards />}
        <div>
          <Button
            color={theme.color.tertiary}
            onClick={this.props.handleClose}>
            Close
          </Button>
        </div>
        <InvalidInputError/>
      </ModalContainer>
    )
  }
}

export default ReservedCardsModal
