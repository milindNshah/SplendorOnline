import React from 'react'
import styled from "styled-components"
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import Button from '../../styledcomponents/button.jsx'
import Card from '../Card.jsx'
import theme from '../../styledcomponents/theme.jsx'
import GemStoneTokens from '../GemStoneTokens.jsx'

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

class ReservedCardsModal extends React.Component {
  constructor (props) {
    super(props)
    this.renderCards = this.renderCards.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
  }

  onPurchaseCard(card) {
    console.log("purchasing card", card);
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
            {this.props.isPlayerTurn && this.props.isMyHand ?
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

    return (
      <ModalContainer width={this.props.width}>
        {Object.keys(this.props.reservedCards).length > 0 ? this.renderCards() : <NoCards />}
        <div>
          <Button
            color={theme.color.error}
            onClick={this.props.handleClose}>
            Close
          </Button>
        </div>
      </ModalContainer>
    )
  }
}

export default ReservedCardsModal
