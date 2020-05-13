import React from 'react'
import styled from "styled-components"
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import Button from '../../styledcomponents/button.jsx'
import Card from '../Card.jsx'
import theme from '../../styledcomponents/theme.jsx'

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const Row = styled.div`
  margin: 1rem 0rem;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
`
const Col = styled.div`
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`

class CardsByGemStoneModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      purchasedCardsByType: new Map(),
    }
    this.getPurchasedCardsByTypes = this.getPurchasedCardsByTypes.bind(this)
    this.renderCards = this.renderCards.bind(this)
  }

  componentDidMount() {
    this.getPurchasedCardsByTypes();
  }

  getPurchasedCardsByTypes() {
    const purchasedCards = new Map(Object.entries(this.props.purchasedCards))
    const purchasedCardsByType = Array.from(purchasedCards.keys())
      .reduce((map, key) => {
        const card = purchasedCards.get(key)
        let cardsForType;
        if (map.has(card.gemStoneType)) {
          cardsForType = map.get(card.gemStoneType)
          cardsForType.push(card)
        } else {
          cardsForType = []
          cardsForType.push(card)
        }
        return map.set(card.gemStoneType, cardsForType)
      }, new Map())
    this.setState({
      purchasedCardsByType: purchasedCardsByType,
    })
  }

  renderCards() {
    if(!this.state.purchasedCardsByType.get(this.props.gemStone)) {
      return;
    };
    const cards = this.state.purchasedCardsByType.get(this.props.gemStone)
      .map((card) => {
        return <Col key={card.id}><Card card={card} width={theme.card.modal.width} height={theme.card.modal.height}/></Col>
    })
    return (<Row>{cards}</Row>)
  }

  render() {
    const NoCards = () => (
      this.props.isMyHand
      ? <p>You own no cards of this type yet.</p>
      : <p>This player owns no cards of this type.</p>
    )

    return (
      <ModalContainer width={this.props.width}>
        <CardsContainer>
          {this.state.purchasedCardsByType.get(this.props.gemStone)
            ? this.renderCards()
            : <NoCards />
          }
          <div>
            <Button
              color={theme.color.tertiary}
              onClick={this.props.handleClose}>
              Close
          </Button>
          </div>
        </CardsContainer>
      </ModalContainer>
    )
  }

}

export default CardsByGemStoneModal
