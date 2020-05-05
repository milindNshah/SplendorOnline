import React from 'react';
import styled from 'styled-components'
import GemStoneToken from './GemStoneToken.jsx'
import Card from './Card.jsx'
import Noble from './Noble.jsx'
import CardModal from './modals/CardModal.jsx'
import NobleModal from './modals/NobleModal.jsx'
import OutsideAlerter from './modals/OutsideAlerter.jsx'
import theme from '../styledcomponents/theme.jsx'
import Overlay from '../styledcomponents/overlay.jsx'
import Modal from '../styledcomponents/modal.jsx'

const PlayerContainer = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
`
const PlayerWidthContainer = styled.div`
  border: 1px solid ${props => props.theme.color.black};
  width: ${ props => `${props.width}rem`};
  min-width: ${ props => `${props.width}rem`};
`
const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSize};
`
const NameCol = styled.p`
  width: ${ props => `${props.width*4/6}rem`};
  color: ${ props => props.theme.color.secondary};
  align-self: flex-start;
`
const IconCol = styled.p`
  color: ${ props => props.expanded ? props.theme.color.error : props.theme.color.secondary};
  width: ${ props => `${props.width*1/6}rem`};
`
const ScoreCol = styled.p`
  width: ${ props => `${props.width*1/6}rem`};
`
const Row = styled.div`
  margin: 0.5rem 0rem;
  display: flex;
  justify-content: space-evenly;
`
const PlayerRow = styled(Row)`
  justify-content: flex-start;
`
const Col = styled.div`
  margin: 0rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const CardCol = styled.div`
  height: ${ props => `${props.height}rem`};
`
const CardsCol = styled.div`
  margin-top: 0.5rem;
  margin-bottom: ${ props => `${props.height}rem`};
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
      expandInfo: false,
      cardClicked: null,
      reservedCardClicked: null,
      nobleClicked: null,
    }
    this.getPurchasedCardsByTypes = this.getPurchasedCardsByTypes.bind(this)
    this.onCardClick = this.onCardClick.bind(this)
    this.onCardModalClose = this.onCardModalClose.bind(this)
    this.onCloseInfo = this.onCloseInfo.bind(this)
    this.onExpandInfo = this.onExpandInfo.bind(this)
    this.onNobleClick = this.onNobleClick.bind(this)
    this.onNobleModalClose = this.onNobleModalClose.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReservedCardClick = this.onReservedCardClick.bind(this)
    this.onReservedCardModalClose = this.onReservedCardModalClose.bind(this)
    this.renderExtraInfo = this.renderExtraInfo.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderNobles = this.renderNobles.bind(this)
    this.renderReservedCards = this.renderReservedCards.bind(this)
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

  onExpandInfo() {
    this.setState({
      expandInfo: true,
    })
  }

  onCloseInfo() {
    this.setState({
      expandInfo: false,
    })
  }

  renderExtraInfo() {
    return (
      <div>
        {this.renderGemStoneTokens()}
        {this.renderReservedCards()}
        {this.renderNobles()}
      </div>)
  }

  renderGemStoneTokens() {
    const purchasedCards = this.getPurchasedCardsByTypes();
    const gemStones = new Map(Object.entries(this.state.hand.gemStones));
    const rows = Array.from(gemStones.keys())
      .map((gemStone) => this.renderGemStoneToken(gemStone, gemStones.get(gemStone), purchasedCards.get(gemStone)))
    return (<Row>{rows}</Row>);
  }

  renderGemStoneToken(gemStone, amount, cards) {
    let cardsArr = [];
    if(cards) {
      cardsArr = cards.map((card) =>
        <CardCol key={card.id} onClick={() => this.onCardClick(card)} height={(((this.props.width-10)/7)*4/3)/2}>
          <Card card={card} width={(this.props.width-10)/7} height={((this.props.width-10)/7)*4/3} doNotRenderRequired={"true"}/>
        </CardCol>)
    }

    return (<Col key={gemStone}>
      <GemStoneToken
        type={gemStone}
        amount={amount}
        width={this.props.width/12}
        height={this.props.width/12}
      />
      <CardsCol height={(((this.props.width-10)/7)*4/3)/2}>{cardsArr}</CardsCol>
    </Col>

    )
  }

  renderReservedCards() {
    const reservedCards = new Map(Object.entries(this.state.hand.reservedCards))
    const rows = Array.from(reservedCards.values())
      .map((card) => {
        return (
          <Col key={card.id} onClick={() => this.onReservedCardClick(card)}>
            <Card card={card} width={(this.props.width - 10) / 7} height={((this.props.width - 10) / 7) * 4 / 3} />
          </Col>
        )
      })
    return (<PlayerRow>{rows}</PlayerRow>)
  }

  renderNobles() {
    const nobles = new Map(Object.entries(this.state.hand.nobles))
    const rows = Array.from(nobles.values())
      .map((noble) => {
        return (
          <Col key={noble.id} onClick={() => this.onNobleClick(noble)}>
            <Noble noble={noble} width={(this.props.width - 10) / 7} height={(this.props.width - 10) / 7} />
          </Col>
        )
      })
    return (<PlayerRow>{rows}</PlayerRow>)
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

  getPurchasedCardsByTypes() {
    const purchasedCards = new Map(Object.entries(this.state.hand.purchasedCards))
    const byType = Array.from(purchasedCards.keys())
      .reduce((map, key) => {
        const card = purchasedCards.get(key)
        let cardsForType;
        if(map.has(card.gemStoneType)) {
          cardsForType = map.get(card.gemStoneType)
          cardsForType.push(card)
        } else {
          cardsForType = []
          cardsForType.push(card)
        }
        return map.set(card.gemStoneType, cardsForType)
      }, new Map())
    return byType
  }

  render() {
    return (
      <PlayerContainer>
        {(this.state.cardClicked || this.state.reservedCardClicked || this.state.nobleClicked)
          ? <Overlay></Overlay>
          : null
        }
        <PlayerWidthContainer width={this.props.width}>
          <PlayerHeader>
            <NameCol width={this.props.width}>{this.state.playerName}</NameCol>
            <ScoreCol width={this.props.width}>Score: {this.state.hand.score}</ScoreCol>
            {
              this.state.expandInfo
                ? <IconCol expanded="true" width={this.props.width}><span onClick={this.onCloseInfo}><i className="fa fa-minus"></i></span></IconCol>
                : <IconCol width={this.props.width}><span onClick={this.onExpandInfo}><i className="fa fa-plus"></i></span></IconCol>
            }
          </PlayerHeader>
          {this.state.expandInfo
            ? this.renderExtraInfo()
            : null
          }
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
                  width={theme.board.width}
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
                  width={theme.board.width}
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
      </PlayerContainer>
    )
  }
}

export default Player
