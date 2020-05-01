import React from 'react'
import styled from 'styled-components'
import GemStoneToken from './GemStoneToken.jsx'
import Card from './Card.jsx'
import Noble from './Noble.jsx'
import TierCard from './TierCard.jsx'

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
`

const Table = styled.div`
  border: 2px solid ${ props => props.theme.color.black };
  display: flex;
  flex-direction: column;
  width: ${ props => props.theme.board.width};
  min-width: ${ props => props.theme.board.width};
`
const Row = styled.div`
  margin: 0.5rem 0rem;
  display: flex;
  justify-content: space-evenly;
`
const GemRow = styled(Row)`
  justify-content: center;
`
const Col = styled.div`
  display: flex;
  margin: 0rem ${ props => props.theme.board.colLeftRightMargin};
`

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
    const tokens = Object.keys(this.state.board.availableGemStones)
      .map((gemstone) => this.renderGemStoneToken(gemstone, this.state.board.availableGemStones[gemstone]))
    return (<GemRow>{tokens}</GemRow>)
  }

  renderGemStoneToken(gemStone, amount) {
    return (<Col key={gemStone}><GemStoneToken type={gemStone} amount={amount}/></Col>)
  }

  renderNobles() {
    if(!this.state.board.activeNobles) {
      return;
    }
    const nobles = Object.values(this.state.board.activeNobles)
      .map((noble) => this.renderNoble(noble))
    return (<Row>{nobles}</Row>)
  }

  renderNoble(noble) {
    return (<Col key={noble.id}><Noble noble={noble}/></Col>)
  }

  renderTieredCards() {
    if(!this.state.board.activeTieredCards || !this.state.board.remainingTieredCards) {
      return;
    }
    return Object.keys(this.state.board.activeTieredCards)
      .map((tier) => {
        let remaining = Object.keys(this.state.board.remainingTieredCards[tier]).length;
        return this.renderCards(tier, remaining, this.state.board.activeTieredCards[tier])
      })
      .reverse()
  }

  renderCards(tier, remaining, cardsByTier) {
    const tierCard = this.renderTierCard(tier, remaining);
    const mainCards = Object.values(cardsByTier)
      .map((card) => this.renderCard(card))
    const cards = [tierCard, ...mainCards];
    return (<Row key={tier}>{cards}</Row>)
  }

  renderCard(card) {
    return (<Col key={card.id}><Card card={card}/></Col>)
  }

  renderTierCard(tier, remaining) {
    return (<Col key={tier}><TierCard tier={tier} remaining={remaining}/></Col>)
  }

  render() {
    return (
      <BoardContainer>
        <Table>
        {this.renderGemStoneTokens()}
        {this.renderNobles()}
        {this.renderTieredCards()}
        </Table>
      </BoardContainer>
    )
  }
}

export default Board;
