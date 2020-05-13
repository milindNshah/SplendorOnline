import React from 'react';
import styled from 'styled-components'
import Noble from './Noble.jsx'
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
const NobleCol = styled.div`
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
      hand: this.props.player?.hand,
      isMyHand: this.props.isMyHand,
      isMyTurn: this.props.isMyTurn,
      isThisPlayerTurn: this.props.isThisPlayerTurn,
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
  }

  componentDidUpdate(prevProps) {
    console.log("player component updating")
    if (this.props.player !== prevProps.player |
      this.props.isMyTurn !== prevProps.isMyTurn) {
      this.setState({
        isMyHand: this.props.isMyHand,
        isMyTurn: this.props.isMyTurn,
        isThisPlayerTurn: this.props.isThisPlayerTurn,
        hand: this.props.player.hand,
        playerID: this.props.player.id,
        playerName: this.props.player.user.name,
      });
    }
  }

  renderNobles() {
    const nobles = new Map(Object.entries(this.state.hand.nobles))
    const rows = Array.from(nobles.values())
      .map((noble) => {
        return (
          <NobleCol key={noble.id} onClick={() => this.onNobleClick(noble)}>
            <Noble noble={noble} width={theme.card.icon.width} height={theme.card.icon.width} />
          </NobleCol>
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
      reservedCardClicked: null,
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
            <NameCol width={this.props.width} isTurn={this.props.isThisPlayerTurn}>
              {this.props.isThisPlayerTurn ? <i className="fa fa-arrow-right" /> : null}
              <Name>{this.state.playerName}</Name>
            </NameCol>
            <ScoreCol width={this.props.width}>Score: {this.state.hand.score}</ScoreCol>
          </PlayerHeader>
          <GemStoneTokens
            isCardTokenClickable={true}
            gemStones={this.state.hand.gemStones}
            purchasedCards={this.state.hand.purchasedCards}
            reservedCards={this.state.hand.reservedCards}
            handleClick={this.onCardClick}
            handleReservedClick={this.onReservedCardClick}
            handleTokenClick={() => { }}
          />
          {this.renderNobles()}
        </PlayerWidthContainer>
        {this.state.cardClicked
          ?
          (
            <Modal>
              <OutsideAlerter handleClose={this.onCardModalClose}>
                <CardsByGemStoneModal
                  gemStone={this.state.cardClicked}
                  isMyHand={this.state.isMyHand}
                  handleClose={this.onCardModalClose}
                  purchasedCards={this.state.hand.purchasedCards}
                  width={theme.card.modal.width * 3 + theme.card.spaceBetween * 6}
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
                  isMyHand={this.state.isMyHand}
                  isMyTurn={this.state.isMyTurn}
                  handleClose={this.onReservedCardModalClose}
                  handlePurchaseCard={this.onPurchaseCard}
                  gemStones={this.state.hand.gemStones}
                  purchasedCards={this.state.hand.purchasedCards}
                  reservedCards={this.state.hand.reservedCards}
                  width={theme.card.modal.width * 3}
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
