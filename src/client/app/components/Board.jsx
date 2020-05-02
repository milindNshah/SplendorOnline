import React from 'react'
import styled from 'styled-components'
import GemStoneToken from './GemStoneToken.jsx'
import Card from './Card.jsx'
import Noble from './Noble.jsx'
import TierCard from './TierCard.jsx'
import CardModal from './CardModal.jsx'
import TokenModal from './TokenModal.jsx'
import OutsideAlerter from './OutsideAlerter.jsx'
import theme from '../styledcomponents/theme.jsx'

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`
const ModalContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`
const Overlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.7;
  z-index: 2;
`

const Table = styled.div`
  border: 2px solid ${ props => props.theme.color.black};
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
  margin: 0rem ${props => `${props.theme.board.spaceBetweenCards}rem`};
`

class Board extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      board: this.props.board,
      cardClicked: null,
      tokenClicked: false,
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: this.props.playerGemStones,
    }
    this.onCardClick = this.onCardClick.bind(this)
    this.onCardModalClose = this.onCardModalClose.bind(this)
    this.onTokenClick = this.onTokenClick.bind(this)
    this.onTokenModalClose = this.onTokenModalClose.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onPurchaseTokens = this.onPurchaseTokens.bind(this)
    this.onReserveCard = this.onReserveCard.bind(this)
    this.renderCard = this.renderCard.bind(this)
    this.renderCards = this.renderCards.bind(this)
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
    this.renderNoble = this.renderNoble.bind(this)
    this.renderNobles = this.renderNobles.bind(this)
    this.renderTierCard = this.renderTierCard.bind(this)
    this.renderTieredCards = this.renderTieredCards.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.board !== prevProps.board ||
      this.props.playerGemStones !== prevProps.playerGemStones) {
      this.setState({
        board: this.props.board,
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: this.props.playerGemStones,
      });
    }
  }

  renderGemStoneTokens() {
    if (!this.state.board.availableGemStones) {
      return;
    }
    const tokens = Object.keys(this.state.board.availableGemStones)
      .map((gemstone) => this.renderGemStoneToken(gemstone, this.state.board.availableGemStones[gemstone]))
    return (<GemRow>{tokens}</GemRow>)
  }

  renderGemStoneToken(gemStone, amount) {
    return (<Col key={gemStone} onClick={this.onTokenClick}>
      <GemStoneToken
        type={gemStone}
        amount={amount}
        width={theme.token.width}
        height={theme.token.height}
        />
      </Col>)
  }

  onTokenClick() {
    this.setState({
      tokenClicked: true,
    })
  }

  onTokenModalClose() {
    this.setState({
      tokenClicked: false,
    })
  }

  onPurchaseTokens(tokensTaken, tokensReturned) {
    this.props.onPurchaseTokens(tokensTaken, tokensReturned);
    this.setState({
      tokenClicked: false,
    })
  }

  renderNobles() {
    if (!this.state.board.activeNobles) {
      return;
    }
    const nobles = Object.values(this.state.board.activeNobles)
      .map((noble) => this.renderNoble(noble))
    return (<Row>{nobles}</Row>)
  }

  renderNoble(noble) {
    return (<Col key={noble.id}><Noble noble={noble} width={theme.card.width} height={theme.card.width}/></Col>)
  }

  renderTieredCards() {
    if (!this.state.board.activeTieredCards || !this.state.board.remainingTieredCards) {
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
    return (<Col onClick={() => this.onCardClick(card)} key={card.id}><Card card={card} width={theme.card.width} height={theme.card.height}/></Col>)
  }

  onCardClick(card) {
    this.setState({
      cardClicked: card,
    })
  }

  onCardModalClose() {
    this.setState({
      cardClicked: null,
    })
  }

  onPurchaseCard() {
    this.props.onPurchaseCard(this.state.cardClicked);
    this.setState({
      cardClicked: null,
    })
  }

  onReserveCard() {
    this.props.onReserveCard(this.state.cardClicked);
    this.setState({
      cardClicked: null,
    })
  }

  renderTierCard(tier, remaining) {
    return (<Col key={tier}><TierCard tier={tier} remaining={remaining} width={theme.card.width} height={theme.card.height}/></Col>)
  }

  // TODO: Press escape to close modal
  render() {
    return (
      <BoardContainer>
        {(this.state.cardClicked || this.state.tokenClicked)
          ? <Overlay></Overlay>
          : null
        }
        <Table>
          {this.renderGemStoneTokens()}
          {this.renderNobles()}
          {this.renderTieredCards()}
        </Table>
        {this.state.cardClicked
          ?
          (
            <ModalContainer>
              <OutsideAlerter handleClose={this.onCardModalClose}>
                <CardModal
                  card={this.state.cardClicked}
                  isPlayerTurn={this.state.isPlayerTurn}
                  handleClose={this.onCardModalClose}
                  handlePurchaseCard={this.onPurchaseCard}
                  handleReserveCard={this.onReserveCard}
                />
              </OutsideAlerter>
            </ModalContainer>
          )
          : null
        }
        {this.state.tokenClicked
          ?
          (
            <ModalContainer>
              <OutsideAlerter handleClose={this.onTokenModalClose}>
                <TokenModal
                  isPlayerTurn={this.state.isPlayerTurn}
                  playerGemStones={this.state.playerGemStones}
                  availableGemStones={this.state.board.availableGemStones}
                  handleClose={this.onTokenModalClose}
                  handlePurchaseTokens={this.onPurchaseTokens}
                />
              </OutsideAlerter>
            </ModalContainer>
          )
          : null
        }
      </BoardContainer>
    )
  }
}

export default Board;
