import React from 'react';
import styled from 'styled-components'
import CardToken from '../styledcomponents/card-token.jsx'
import theme from '../styledcomponents/theme.jsx'
import GemStoneToken from './GemStoneToken.jsx'
import { GemStone, getColorFromGemStone } from '../enums/gemstones.js'
import { GemStoneBase } from './GemStone.jsx'
import { getPurchasedCardsByTypes } from '../utils';

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
      filterOutReservedCardToken: this.props.filterOutReservedCardToken ?? false,
    }
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
  }

  renderGemStoneTokens() {
    if(!this.props.gemStones || !this.props.purchasedCards) {
      return;
    }

    const purchasedCardsByTypes = getPurchasedCardsByTypes(this.props.purchasedCards);
    const gemStones = new Map(Object.entries(this.props.gemStones));
    return (
      <Row>
        {
          Array.from(gemStones.keys())
            .filter((gemStone) => !(gemStone === GemStone.GOLD && this.state.filterOutGold))
            .map((gemStone) => this.renderGemStoneToken(gemStone, gemStones.get(gemStone), purchasedCardsByTypes.get(gemStone)))
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
          isClickable={this.props.isGemStoneTokenClickable && amount !== 0}
          opacity={amount === 0 ? theme.gemStoneIsZero.opacity : 1}
        />
        {this.state.filterOutPurchasedCardTokens ? null
          : GemStone.GOLD === gemStone ?
            this.state.filterOutReservedCardToken ? null
              : <CardToken
                  onClick={() => {
                    if (resCardsAmount !== 0) {
                      this.props.handleReservedClick(gemStone)
                    }
                  }}
                  type={gemStone}
                  width={theme.card.icon.width}
                  height={theme.card.icon.height}
                  isClickable={this.props.isCardTokenClickable && resCardsAmount !== 0}
                  opacity={resCardsAmount === 0 ? theme.gemStoneIsZero.opacity : 1}
                >
                {resCardsAmount}
                <ReservedCardIcon
                  type={gemStone}
                  width={theme.card.icon.gemStone.width}
                  height={theme.card.icon.gemStone.height}>
                  R
                </ReservedCardIcon>
              </CardToken>
            : <CardToken
                onClick={() => {
                  if(cardAmount !== 0) {
                    this.props.handleClick(gemStone)
                  }
                }}
                type={gemStone}
                width={theme.card.icon.width}
                height={theme.card.icon.height}
                isClickable={this.props.isCardTokenClickable && cardAmount !== 0}
                opacity={cardAmount === 0 ? theme.gemStoneIsZero.opacity : 1}
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
    return this.renderGemStoneTokens()
  }
}

export default GemStoneTokens
