import React from 'react'
import styled from "styled-components"
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import Button from '../../styledcomponents/button.jsx'
import Card from '../Card.jsx'
import theme from '../../styledcomponents/theme.jsx'
import { getPurchasedCardsByTypes } from '../../utils';

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
      purchasedCardsByTypes: new Map(),
    }
    this.renderCards = this.renderCards.bind(this)
  }

  componentDidMount() {
    const purchasedCardsByTypes = getPurchasedCardsByTypes(this.props.purchasedCards)
    this.setState({
      purchasedCardsByTypes: purchasedCardsByTypes,
    })
  }

  renderCards() {
    if(!this.state.purchasedCardsByTypes.get(this.props.gemStone)) {
      return;
    };
    const cards = this.state.purchasedCardsByTypes.get(this.props.gemStone)
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
      <ModalContainer maxWidth={this.props.maxWidth}>
        <CardsContainer>
          {this.state.purchasedCardsByTypes.get(this.props.gemStone)
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
