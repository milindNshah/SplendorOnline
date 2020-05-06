import React from 'react';
import styled from 'styled-components'
import CardToken from '../styledcomponents/card-token.jsx'
import theme from '../styledcomponents/theme.jsx'
import GemStoneToken from './GemStoneToken.jsx'
import { GemStone, getColorFromGemStone } from '../enums/gemstones.js'
import { GemStoneBase } from './GemStone.jsx'

const Row = styled.div`
  margin: 0.5rem 0rem;
  display: flex;
  justify-content: flex-start;
`
const Col = styled.div`
  margin: 0rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ReservedCardIcon = styled.div`
  color: ${ props => getColorFromGemStone(props.type) };
  width: ${ props => `${props.width}rem` };
  height: ${ props => `${props.height}rem` };
  text-align: center;
`

class GemStoneTokens extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      filterOutGold: this.props.filterOutGold ?? false,
      filterOutPurchasedCardTokens: this.props.filterOutPurchasedCardTokens ?? false,
    }
    console.log(this.props.isCardTokenClickable)
    this.getPurchasedCardsByTypes = this.getPurchasedCardsByTypes.bind(this)
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
  }

  getPurchasedCardsByTypes() {
    const purchasedCards = new Map(Object.entries(this.props.purchasedCards))
    return Array.from(purchasedCards.keys())
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
  }

  renderGemStoneTokens() {
    if(!this.props.gemStones || !this.props.purchasedCards) {
      return;
    }

    const purchasedCards = this.getPurchasedCardsByTypes();
    const gemStones = new Map(Object.entries(this.props.gemStones));
    return (
      <Row>
        {
          Array.from(gemStones.keys())
            .filter((gemStone) => !(gemStone === GemStone.GOLD && this.state.filterOutGold))
            .map((gemStone) => this.renderGemStoneToken(gemStone, gemStones.get(gemStone), purchasedCards.get(gemStone)))
        }
      </Row>
    )
  }

  renderGemStoneToken(gemStone, amount, cards) {
    const cardAmount = cards ? cards.length : 0
    const resCardsAmount = this.props.reservedCards ? Object.keys(this.props.reservedCards).length : 0

    return (
      <Col key={gemStone} onClick={() => this.props.handleTokenClick(gemStone)}>
        <GemStoneToken
          type={gemStone}
          amount={amount}
          width={theme.token.modal.width}
          height={theme.token.modal.height}
          isClickable={this.props.isGemStoneTokenClickable}
        />
        { this.state.filterOutPurchasedCardTokens ? null
        : GemStone.GOLD === gemStone
          ? <CardToken onClick={() => this.props.handleReservedClick()}
            type={gemStone}
            width={theme.card.icon.width}
            height={theme.card.icon.height}
            isClickable={this.props.isCardTokenClickable}
          >
            {resCardsAmount}
            <ReservedCardIcon
              type={gemStone}
              width={theme.card.icon.gemStone.width}
              height={theme.card.icon.gemStone.height}>
                R
            </ReservedCardIcon>
          </CardToken>
          : <CardToken onClick={() => this.props.handleClick(gemStone)}
            type={gemStone}
            width={theme.card.icon.width}
            height={theme.card.icon.height}
            isClickable={this.props.isCardTokenClickable}
          >
            {cardAmount}
            <GemStoneBase
              type={gemStone}
              width={theme.card.icon.gemStone.width}
              height={theme.card.icon.gemStone.height}
              fill="true"
            />
          </CardToken>
        }
      </Col>
    )
  }

  render() {
    return (
      <div>{this.renderGemStoneTokens()}</div>
    )
  }
}

export default GemStoneTokens
