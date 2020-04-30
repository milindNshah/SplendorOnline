import React from 'react'
import styled from 'styled-components'
import GemStoneToken from './GemStoneToken.jsx'
import Card from './Card.jsx'
import Noble from './Noble.jsx'
import TierCard from './TierCard.jsx'

class Board extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      board: this.props.board
    }
    this.renderCard = this.renderCard.bind(this)
    this.renderCards = this.renderCards.bind(this)
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
    this.renderNoble = this.renderNoble.bind(this)
    this.renderNobles = this.renderNobles.bind(this)
    this.renderTierCard = this.renderTierCard.bind(this)
    this.renderTieredCards = this.renderTieredCards.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (this.props.board !== prevProps.board) {
      this.setState({board: this.props.board});
    }
  }

  renderGemStoneTokens() {
    if(!this.state.board.availableGemStones) {
      return;
    }
    return Object.keys(this.state.board.availableGemStones)
      .map((gemstone) => this.renderGemStoneToken(gemstone, this.state.board.availableGemStones[gemstone]))
  }

  renderGemStoneToken(gemStone, amount) {
    return (<GemStoneToken key={gemStone} type={gemStone} amount={amount}/>)
  }

  renderNobles() {
    if(!this.state.board.activeNobles) {
      return;
    }
    return Object.values(this.state.board.activeNobles)
      .map((noble) => this.renderNoble(noble))
  }

  renderNoble(noble) {
    return (<Noble key={noble.id} noble={noble}/>)
  }

  renderTieredCards() {
    if(!this.state.board.activeTieredCards) {
      return;
    }
    return Object.keys(this.state.board.activeTieredCards)
      .map((tier) => this.renderCards(tier, this.state.board.activeTieredCards[tier]))
  }

  renderCards(tier, cardsByTier) {
    const tierCard = this.renderTierCard(tier);
    const mainCards = Object.values(cardsByTier)
      .map((card) => this.renderCard(card))
    return [tierCard, ...mainCards];
  }

  renderCard(card) {
    return (<Card key={card.id} card={card}/>)
  }

  renderTierCard(tier) {
    return (<TierCard tier={tier} key={tier}/>)
  }

  render() {
    return (
      <div>
        <div>Board</div>
        {this.renderGemStoneTokens()}
        {this.renderNobles()}
        {this.renderTieredCards()}
      </div>
    )
  }
}

export default Board;
