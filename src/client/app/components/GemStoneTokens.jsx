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
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
  }

  renderGemStoneTokens() {
    if(!this.props.gemStones || !this.props.purchasedCards) {
      return <div></div>;
    }
    const purchasedCardsByTypes = getPurchasedCardsByTypes(this.props.purchasedCards);
    return (
      <Row>
        {
          Array.from(this.props.gemStones.keys())
            .filter((gemStone) => !(gemStone === GemStone.GOLD && this.props.filterOutGold))
            .map((gemStone) => this.renderGemStoneToken(gemStone, this.props.gemStones.get(gemStone), purchasedCardsByTypes.get(gemStone)))
        }
      </Row>
    )
  }

  renderGemStoneToken(gemStone, amount, cards) {
    const cardAmount = cards ? cards.length : 0
    const resCardsAmount = this.props.reservedCards ? Object.keys(this.props.reservedCards).length : 0

    return (
      <Col
        key={gemStone}
        onClick={() => {
          if(this.props.isGemStoneTokenClickable && amount !== 0 && this.props.handleTokenClick) {
            this.props.handleTokenClick(gemStone)
          }
        }}>
        <GemStoneToken
          type={gemStone}
          amount={amount}
          width={theme.token.modal.width}
          height={theme.token.modal.height}
          isClickable={this.props.isGemStoneTokenClickable && amount !== 0 && this.props.handleTokenClick}
          opacity={amount === 0 ? theme.gemStoneIsZero.opacity : 1}
        />
        {this.props.filterOutPurchasedCardTokens ? null
          : GemStone.GOLD === gemStone ?
            this.props.filterOutReservedCardToken ? null
              : <CardToken
                  onClick={() => {
                    if (this.props.isCardTokenClickable && resCardsAmount !== 0 && this.props.handleReservedClick) {
                      this.props.handleReservedClick(gemStone)
                    }
                  }}
                  type={gemStone}
                  width={theme.card.icon.width}
                  height={theme.card.icon.height}
                  isClickable={this.props.isCardTokenClickable && resCardsAmount !== 0 && this.props.handleReservedClick}
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
                  if(this.props.isCardTokenClickable && cardAmount !== 0 && this.props.handleClick) {
                    this.props.handleClick(gemStone)
                  }
                }}
                type={gemStone}
                width={theme.card.icon.width}
                height={theme.card.icon.height}
                isClickable={this.props.isCardTokenClickable && cardAmount !== 0 && this.props.handleClick}
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
