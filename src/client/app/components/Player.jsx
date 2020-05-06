import React from 'react';
import styled from 'styled-components'
import Card from './Card.jsx'
import Noble from './Noble.jsx'
import CardModal from './modals/CardModal.jsx'
import NobleModal from './modals/NobleModal.jsx'
import OutsideAlerter from './modals/OutsideAlerter.jsx'
import theme from '../styledcomponents/theme.jsx'
import Overlay from '../styledcomponents/overlay.jsx'
import Modal from '../styledcomponents/modal.jsx'
import GemStoneTokens from './GemStoneTokens.jsx'

const PlayerWidthContainer = styled.div`
  border: 1px solid ${props => props.theme.color.black};
  width: ${ props => `${props.width}rem`};
  padding: 1rem;
`
const PlayerHeader = styled.div`
  display: flex;
  align-items: center;
`
const NameCol = styled.div`
  width: ${ props => `${props.width*4/6}rem`};
  color: ${ props => props.theme.color.secondary};
  align-self: flex-start;
  font-size: 1.5rem;
`
const ScoreCol = styled.div`
  width: ${ props => `${props.width*2/6}rem`};
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
`

class Player extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hand: this.props.player?.hand,
      isMyHand: this.props.isMyHand,
      isPlayerTurn: this.props.isPlayerTurn,
      playerID: this.props.player?.id,
      playerName: this.props.player?.user?.name,
      cardClicked: null,
      reservedCardClicked: null,
      nobleClicked: null,
    }
    this.onCardClick = this.onCardClick.bind(this)
    this.onCardModalClose = this.onCardModalClose.bind(this)
    this.onNobleClick = this.onNobleClick.bind(this)
    this.onNobleModalClose = this.onNobleModalClose.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReservedCardClick = this.onReservedCardClick.bind(this)
    this.onReservedCardModalClose = this.onReservedCardModalClose.bind(this)
    this.renderNobles = this.renderNobles.bind(this)
    // this.renderReservedCards = this.renderReservedCards.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.player !== prevProps.player |
      this.props.isPlayerTurn !== prevProps.isPlayerTurn) {
      this.setState({
        isMyHand: this.props.isMyHand,
        isPlayerTurn: this.props.isPlayerTurn,
        hand: this.props.player.hand,
        playerID: this.props.player.id,
        playerName: this.props.player.user.name,
      });
    }
  }

  // renderReservedCards() {
  //   const reservedCards = new Map(Object.entries(this.state.hand.reservedCards))
  //   const rows = Array.from(reservedCards.values())
  //     .map((card) => {
  //       return (
  //         <Col key={card.id} onClick={() => this.onReservedCardClick(card)}>
  //           <Card card={card} width={theme.card.icon.width} height={theme.card.icon.height} />
  //         </Col>
  //       )
  //     })
  //   return (<Row>{rows}</Row>)
  // }

  renderNobles() {
    const nobles = new Map(Object.entries(this.state.hand.nobles))
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

  onReservedCardClick(card) {
    this.setState({
      reservedCardClicked: card,
    })
  }

  onReservedCardModalClose() {
    this.setState({
      reservedCardClicked: null,
    })
  }

  onPurchaseCard() {
    this.props.handlePurchaseCard(this.state.reservedCardClicked)
    this.setState({
      reservedCardClicked: null,
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

  render() {
    return (
      <div>
        {(this.state.cardClicked || this.state.reservedCardClicked || this.state.nobleClicked)
          ? <Overlay></Overlay>
          : null
        }
        <PlayerWidthContainer width={this.props.width}>
          <PlayerHeader>
            <NameCol width={this.props.width}>{this.state.playerName}</NameCol>
            <ScoreCol width={this.props.width}>Score: {this.state.hand.score}</ScoreCol>
          </PlayerHeader>
          <GemStoneTokens
            gemStones={this.state.hand.gemStones}
            purchasedCards={this.state.hand.purchasedCards}
            reservedCards={this.state.hand.reservedCards}
            handleClick={this.onCardClick}
          />
          { this.renderNobles() }
        </PlayerWidthContainer>
        {this.state.cardClicked
          ?
          (
            <Modal>
              <OutsideAlerter handleClose={this.onCardModalClose}>
                <CardModal
                  card={this.state.cardClicked}
                  isPlayerTurn={this.state.isPlayerTurn}
                  handleClose={this.onCardModalClose}
                  width={theme.card.modal.width}
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
                <CardModal
                  card={this.state.reservedCardClicked}
                  isMyHand={this.state.isMyHand}
                  isPlayerTurn={this.state.isPlayerTurn}
                  handleClose={this.onReservedCardModalClose}
                  handlePurchaseCard={this.onPurchaseCard}
                  playerGemStones={this.state.hand?.gemStones}
                  playerPurchasedCards={this.state.hand?.purchasedCards}
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
