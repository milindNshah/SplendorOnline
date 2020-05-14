import React from 'react'
import styled from "styled-components"
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import Button from '../../styledcomponents/button.jsx'
import Card from '../Card.jsx'
import theme from '../../styledcomponents/theme.jsx'
import GemStoneTokens from '../GemStoneTokens.jsx'
import { canPurchaseCard } from '../../utils';

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

  onPurchaseCard(card) {
    const canPurchase = canPurchaseCard(card, this.props.purchasedCards, this.props.gemStones)
    if (!canPurchase) {
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
            gemStones={new Map(Object.entries(this.props.gemStones))}
            purchasedCards={this.props.purchasedCards}
            reservedCards={this.props.reservedCards}
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
