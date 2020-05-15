import React from 'react';
import styled from 'styled-components'
import Noble from './Noble.jsx'
import Card from './Card.jsx'
import NobleModal from './modals/NobleModal.jsx'
import OutsideAlerter from './modals/OutsideAlerter.jsx'
import theme from '../styledcomponents/theme.jsx'
import Overlay from '../styledcomponents/overlay.jsx'
import Modal from '../styledcomponents/modal.jsx'
import GemStoneTokens from './GemStoneTokens.jsx'
import CardsByGemStoneModal from './modals/CardsByGemStoneModal.jsx'
import ReservedCardsModal from './modals/ReservedCardsModal.jsx'

const PlayerWidthContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.color.black};
  width: ${ props => `${props.width}rem`};
  padding: 0rem, 1rem;
`
const PlayerHeader = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  font-family: ${ props => props.theme.fontFamily.tertiary};
`
const NameCol = styled.div`
  width: ${ props => `${props.width * 4 / 6}rem`};
  color: ${ props => props.theme.color.secondary};
  align-self: flex-start;
  font-size: 1.5rem;
`
const Name = styled.span`
  margin-left: 0.5rem;
`
const ScoreCol = styled.div`
  font-size: 1.5rem;
  color: ${ props => props.theme.color.tertiary};
  width: ${ props => `${props.width * 2 / 6}rem`};
  text-align: end;
`
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
  cursor: pointer;
`

class Player extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cardClicked: null,
      colReservedCardClicked: null,
      reservedCardClicked: null,
      nobleClicked: null,
    }
    this.onCardClick = this.onCardClick.bind(this)
    this.onCardModalClose = this.onCardModalClose.bind(this)
    this.onColReservedCardClick = this.onColReservedCardClick.bind(this)
    this.onColReservedCardModalClose = this.onColReservedCardModalClose.bind(this)
    this.onNobleClick = this.onNobleClick.bind(this)
    this.onNobleModalClose = this.onNobleModalClose.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReservedCardClick = this.onReservedCardClick.bind(this)
    this.onReservedCardModalClose = this.onReservedCardModalClose.bind(this)
    this.renderNobles = this.renderNobles.bind(this)
    this.renderReservedCards = this.renderReservedCards.bind(this)
    this.onTokenClick = this.onTokenClick.bind(this)
  }

  onTokenClick(gemStone) {
    if(!this.props.isThisPlayerTurn) {
      return;
    }
    this.props.handleTokenClick(gemStone)
  }

  renderReservedCards() {
    const reservedCards = new Map(Object.entries(this.props.player.hand.reservedCards))
    const rows = Array.from(reservedCards.values())
      .map((card) => {
        return (
          <Col key={card.id} onClick={() => this.onColReservedCardClick(card)}>
            <Card card={card} width={theme.card.reservedCol.width} height={theme.card.reservedCol.height} />
          </Col>
        )
      })
    return (<Row>{rows}</Row>)
  }

  renderNobles() {
    const nobles = new Map(Object.entries(this.props.player.hand.nobles))
    const rows = Array.from(nobles.values())
      .map((noble) => {
        return (
          <Col key={noble.id} onClick={() => this.onNobleClick(noble)}>
            <Noble noble={noble} width={theme.card.icon.width} height={theme.card.icon.width} />
          </Col>
        )
      })
    return (<Row>{rows}</Row>)
  }

  onCardClick(gemStone) {
    this.setState({
      cardClicked: gemStone,
    })
  }

  onCardModalClose() {
    this.setState({
      cardClicked: null,
    })
  }

  onReservedCardClick() {
    this.setState({
      reservedCardClicked: true,
    })
  }

  onReservedCardModalClose() {
    this.setState({
      reservedCardClicked: null,
    })
  }

  onColReservedCardClick(card) {
    this.setState({
      colReservedCardClicked: card,
    })
  }

  onColReservedCardModalClose() {
    this.setState({
      colReservedCardClicked: null,
    })
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

  onPurchaseCard(card) {
    this.props.handlePurchaseCard(card)
    this.setState({
      colReservedCardClicked: null,
      reservedCardClicked: null,
    })
  }

  render() {
    return (
      <div>
        {(this.state.cardClicked || this.state.colReservedCardClicked || this.state.reservedCardClicked || this.state.nobleClicked)
          ? <Overlay></Overlay>
          : null
        }
        <PlayerWidthContainer width={this.props.width}>
          <PlayerHeader>
            <NameCol width={this.props.width} isTurn={this.props.isThisPlayerTurn}>
              {this.props.isThisPlayerTurn ? <i className="fa fa-arrow-right" /> : null}
              <Name>{this.props.player.user.name}</Name>
            </NameCol>
            <ScoreCol width={this.props.width}>Score: {this.props.player.hand.score}</ScoreCol>
          </PlayerHeader>
          {/* // TODO: Add logic so not clickable when not allowed to take anymore of that token. */}
          <GemStoneTokens
            gemStones={new Map(Object.entries(this.props.player.hand.gemStones))}
            purchasedCards={this.props.player.hand.purchasedCards}
            reservedCards={this.props.player.hand.reservedCards}
            handleClick={this.onCardClick}
            handleReservedClick={this.onReservedCardClick}
            handleTokenClick={this.onTokenClick}
            isGemStoneTokenClickable={this.props.isThisPlayerTurn && this.props.isMyTurn}
            isCardTokenClickable={true}
          />
          {this.props.isMyHand ? this.renderReservedCards() : null}
          {this.renderNobles()}
        </PlayerWidthContainer>
        {this.state.cardClicked
          ?
          (
            <Modal>
              <OutsideAlerter handleClose={this.onCardModalClose}>
                <CardsByGemStoneModal
                  gemStone={this.state.cardClicked}
                  isMyHand={this.props.isMyHand}
                  handleClose={this.onCardModalClose}
                  purchasedCards={this.props.player.hand.purchasedCards}
                  maxWidth={theme.card.modal.width * 3 + theme.card.spaceBetween * 6}
                />
              </OutsideAlerter>
            </Modal>
          )
          : null
        }
        {this.state.reservedCardClicked
          ?
          (
            <Modal>
              <OutsideAlerter handleClose={this.onReservedCardModalClose}>
                <ReservedCardsModal
                  isMyHand={this.props.isMyHand}
                  isMyTurn={this.props.isMyTurn}
                  handleClose={this.onReservedCardModalClose}
                  handlePurchaseCard={this.onPurchaseCard}
                  gemStones={this.props.player.hand.gemStones}
                  selectedGemStones={this.props.selectedGemStones}
                  purchasedCards={this.props.player.hand.purchasedCards}
                  reservedCards={this.props.player.hand.reservedCards}
                  maxWidth={theme.card.modal.width * 3 + theme.card.spaceBetween * 6}
                />
              </OutsideAlerter>
            </Modal>
          )
          : null
        }
        {this.state.colReservedCardClicked
          ?
          (
            <Modal>
              <OutsideAlerter handleClose={this.onColReservedCardModalClose}>
                <ReservedCardsModal
                  isMyHand={this.props.isMyHand}
                  isMyTurn={this.props.isMyTurn}
                  handleClose={this.onColReservedCardModalClose}
                  handlePurchaseCard={this.onPurchaseCard}
                  gemStones={this.props.player.hand.gemStones}
                  selectedGemStones={this.props.selectedGemStones}
                  purchasedCards={this.props.player.hand.purchasedCards}
                  reservedCards={{ [this.state.colReservedCardClicked.id]: this.state.colReservedCardClicked }}
                  maxWidth={theme.card.modal.width * 3 + theme.card.spaceBetween * 6}
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
                  noble={this.state.nobleClicked}
                  handleClose={this.onNobleModalClose}
                  width={theme.card.modal.width}
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

export default Player
