import React from 'react'
import styled from 'styled-components'
import GemStoneToken from './GemStoneToken.jsx'
import Card from './Card.jsx'
import Noble from './Noble.jsx'
import TierCard from './TierCard.jsx'
import CardModal from './modals/CardModal.jsx'
import NobleModal from './modals/NobleModal.jsx'
import TierCardModal from './modals/TierCardModal.jsx'
import OutsideAlerter from './modals/OutsideAlerter.jsx'
import theme from '../styledcomponents/theme.jsx'
import Overlay from '../styledcomponents/overlay.jsx'
import Modal from '../styledcomponents/modal.jsx'
import { GemStone } from '../enums/gemstones'

const Table = styled.div`
  display: flex;
  flex-direction: column;
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
  margin: 0rem ${props => `${props.theme.card.spaceBetween}rem`};
  cursor: pointer;
  order: ${ props => props.order ?? 0};
`

class Board extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cardClicked: null,
      tierCardClicked: null,
      nobleClicked: null,
    }
    this.onCardClick = this.onCardClick.bind(this)
    this.onCardModalClose = this.onCardModalClose.bind(this)
    this.onNobleClick = this.onNobleClick.bind(this)
    this.onNobleModalClose = this.onNobleModalClose.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReserveCard = this.onReserveCard.bind(this)
    this.onReserveTierCard = this.onReserveTierCard.bind(this)
    this.onTokenClick = this.onTokenClick.bind(this)
    this.onTierCardClick = this.onTierCardClick.bind(this)
    this.onTierCardModalClose = this.onTierCardModalClose.bind(this)
    this.renderCard = this.renderCard.bind(this)
    this.renderCards = this.renderCards.bind(this)
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
    this.renderNoble = this.renderNoble.bind(this)
    this.renderNobles = this.renderNobles.bind(this)
    this.renderTierCard = this.renderTierCard.bind(this)
    this.renderTieredCards = this.renderTieredCards.bind(this)
  }

  renderGemStoneTokens() {
    if (!this.props.board.availableGemStones) {
      return;
    }
    const tokens = Object.keys(this.props.board.availableGemStones)
      .map((gemstone) => this.renderGemStoneToken(gemstone, this.props.board.availableGemStones[gemstone]))
    return (<GemRow>{tokens}</GemRow>)
  }

  renderGemStoneToken(gemStone, amount) {
    // TODO: Add logic so not clickable when not allowed to take anymore of that token.
    return (<Col key={gemStone} onClick={() => {
      if(this.props.isMyTurn && gemStone !== GemStone.GOLD) {
        this.onTokenClick(gemStone)
      }
    }}>
      <GemStoneToken
        type={gemStone}
        amount={amount}
        width={theme.token.width}
        height={theme.token.height}
        isClickable={this.props.isMyTurn && gemStone !== GemStone.GOLD}
        opacity={amount === 0 ? theme.gemStoneIsZero.opacity : 1}
        />
      </Col>)
  }

  onTokenClick(gemStone) {
    if (!this.props.isMyTurn || gemStone === GemStone.GOLD) {
      return;
    }
    this.props.handleTokenClick(gemStone)
  }

  renderNobles() {
    if (!this.props.board.activeNobles) {
      return;
    }
    const nobles = Object.values(this.props.board.activeNobles)
      .map((noble) => this.renderNoble(noble))
    return (<Row>{nobles}</Row>)
  }

  renderNoble(noble) {
    return (<Col key={noble.id} onClick={() => this.onNobleClick(noble)}><Noble noble={noble} width={theme.card.width} height={theme.card.width}/></Col>)
  }

  onNobleClick(noble) {
    this.setState({
      nobleClicked: noble,
    })
  }

  onNobleModalClose() {
    this.setState({
      nobleClicked: null,
    })
  }

  renderTieredCards() {
    if (!this.props.board.activeTieredCards || !this.props.board.remainingTieredCards) {
      return;
    }
    return Object.keys(this.props.board.activeTieredCards)
      .map((tier) => {
        let remaining = Object.keys(this.props.board.remainingTieredCards[tier]).length;
        return this.renderCards(tier, remaining, this.props.board.activeTieredCards[tier])
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
    return (<Col order={card.boardPosition} onClick={() => this.onCardClick(card)} key={card.id}>
      <Card card={card} width={theme.card.width} height={theme.card.height} />
    </Col>)
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
    this.props.handlePurchaseCard(this.state.cardClicked);
    this.setState({
      cardClicked: null,
    })
  }

  onReserveCard(returnedToken) {
    this.props.handleReserveCard(this.state.cardClicked, returnedToken);
    this.setState({
      cardClicked: null,
    })
  }

  renderTierCard(tier, remaining) {
    return (<Col key={tier} onClick={() => this.onTierCardClick(tier, remaining)}><TierCard tier={tier} remaining={remaining} width={theme.card.width} height={theme.card.height}/></Col>)
  }

  onTierCardClick(tier, remaining) {
    this.setState({
      tierCardClicked: {tier: tier, remaining: remaining},
    })
  }

  onTierCardModalClose() {
    this.setState({
      tierCardClicked: null,
    })
  }

  onReserveTierCard(returnedToken) {
    this.props.handleReserveTierCard(this.state.tierCardClicked.tier, returnedToken)
    this.setState({
      tierCardClicked: null,
    })
  }

  render() {
    return (
      <div>
        {(this.state.cardClicked || this.state.tokenClicked || this.state.nobleClicked || this.state.tierCardClicked)
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
            <Modal>
              <OutsideAlerter handleClose={this.onCardModalClose}>
                <CardModal
                  availableGemStones={this.props.board.availableGemStones}
                  card={this.state.cardClicked}
                  isPlayerTurn={this.props.isMyTurn}
                  handleClose={this.onCardModalClose}
                  handlePurchaseCard={this.onPurchaseCard}
                  handleReserveCard={this.onReserveCard}
                  playerGemStones={this.props.hand.gemStones}
                  playerSelectedGemStones={this.props.selectedGemStones}
                  playerPurchasedCards={this.props.hand.purchasedCards}
                  playerReservedCards={this.props.hand.reservedCards}
                  width={theme.card.icon.width*6+theme.card.spaceBetween*12}
                />
              </OutsideAlerter>
            </Modal>
          )
          : null
        }
        {this.state.nobleClicked
          ?
          (
            <Modal>
              <OutsideAlerter handleClose={this.onNobleModalClose}>
                <NobleModal
                  handleClose={this.onNobleModalClose}
                  noble={this.state.nobleClicked}
                  width={theme.card.modal.width}
                />
              </OutsideAlerter>
            </Modal>
          )
          : null
        }
        {this.state.tierCardClicked
          ?
          (
            <Modal>
              <OutsideAlerter handleClose={this.onTierCardModalClose}>
                <TierCardModal
                  availableGemStones={this.props.board.availableGemStones}
                  isPlayerTurn={this.props.isMyTurn}
                  tier={this.state.tierCardClicked.tier}
                  remaining={this.state.tierCardClicked.remaining}
                  handleClose={this.onTierCardModalClose}
                  handleReserveCard={this.onReserveTierCard}
                  playerGemStones={this.props.hand.gemStones}
                  playerSelectedGemStones={this.props.selectedGemStones}
                  playerPurchasedCards={this.props.hand.purchasedCards}
                  playerReservedCards={this.props.hand.reservedCards}
                  width={theme.card.icon.width*6+theme.card.spaceBetween*12}
                />
              </OutsideAlerter>
            </Modal>
          )
          : null
        }
      </div>
    )
  }
}

export default Board;
