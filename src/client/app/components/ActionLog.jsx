import React from 'react'
import styled from 'styled-components'
import theme from '../styledcomponents/theme.jsx'
import { ActionType } from '../enums/actiontype'
import { GemStoneBase } from './GemStone.jsx'
import Card from './Card.jsx'
import Noble from './Noble.jsx'
import Scroll from 'react-scroll'

const ActionLogContainer = styled.div`
  font-family: ${ props => props.theme.fontFamily.tertiary };
  font-size: 0.8rem;
  color: ${ props => props.theme.color.darkgrey };
  border-left: 2px solid ${ props => props.theme.color.secondary};
  width: ${ props => `${props.width}rem`};
  padding-left: 1rem;
`
const ActionsContainer = styled.div`
  height: ${ props => `${props.theme.actionLog.minHeight}rem`};
  overflow: scroll;

  @media (min-width: 85.125rem) {
    height: ${ props => `${props.theme.actionLog.maxHeight}rem`}
  }

  @media (min-width: 66rem) and (max-width: 85.125rem) {
    height: ${ props => `${props.theme.actionLog.minHeight}rem`}
  }

  @media (min-width: 47.125rem) and (max-width: 66rem) {
    height: ${ props => `${props.theme.actionLog.midHeight}rem`}
  }
`
const TurnContainer = styled.div`
  border-bottom: 1px solid ${ props => props.theme.color.lightgrey };
  margin: 0.25rem 0rem;
`
const ActionLineContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-flow: row wrap;
  margin: 0.25rem 0rem;
`
const GemsContainer = styled.span`
  display: flex;
  flex-flow: row wrap;
  background-color: ${ props => props.theme.color.black};
  padding: 0rem 0.25rem;
  color: white;
`
const GemStoneBaseContainer = styled.div`
  margin: 0rem 0.25rem;
`
const PlayerName = styled.span`
  color: ${ props => props.theme.color.secondary };
`
const InlineCard = styled.div`
  background-color: ${props => props.theme.color.black};
  padding: 0rem 0.25rem;
  color: ${ props => props.theme.color.white };
  text-decoration: underline;
  position: relative;
`
const HoverCardContainer = styled.div`
  position: fixed;
  top: ${ props => props.top };
  left: ${ props => props.left };
  z-index: 2;
`

class ActionLog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cardHover: null,
      cardPosition: null,
      nobleHover: null,
      noblePosition: null,
    }
    this.renderActionLines = this.renderActionLines.bind(this)
    this.renderActionLine = this.renderActionLine.bind(this)
    this.renderTakeGems = this.renderTakeGems.bind(this)
    this.renderPurchaseCard = this.renderPurchaseCard.bind(this)
    this.renderReserveCard = this.renderReserveCard.bind(this)
    this.renderNewActiveCard = this.renderNewActiveCard.bind(this)
    this.renderPlayerCardAction = this.renderPlayerCardAction.bind(this)
    this.renderObtainNoble = this.renderObtainNoble.bind(this)
    this.renderSkipTurn = this.renderSkipTurn.bind(this)
    this.renderPlayerDisconnected = this.renderPlayerDisconnected.bind(this)
    this.renderPlayerDisconnectedTimeout = this.renderPlayerDisconnectedTimeout.bind(this)
    this.renderPlayerReconnected = this.renderPlayerReconnected.bind(this)
    this.renderGameEnded = this.renderGameEnded.bind(this)
    this.renderLeaveGame = this.renderLeaveGame.bind(this)
    this.renderTakenGems = this.renderTakenGems.bind(this)
    this.renderReturnedGems = this.renderReturnedGems.bind(this)
    this.renderGemsFromMap = this.renderGemsFromMap.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  componentDidMount () {
    this.scrollToBottom()
  }
  componentDidUpdate () {
    this.scrollToBottom()
  }
  scrollToBottom() {
    if(this.state.cardHover || this.state.nobleHover) {
      return;
    }
    Scroll.scroller.scrollTo('actions-scroll-to-end', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      containerId: 'actions-container'
    });
  }

  renderActionLines() {
    const actions = this.props.actionLog.map((actionLine, index) => this.renderActionLine(actionLine, index));
    return <div>
      {actions}
      <Scroll.Element name="actions-scroll-to-end"></Scroll.Element>
    </div>;
  }

  renderActionLine(actionLine, index) {
    const actionType = actionLine.type;
    const playerName = actionLine.player?.user?.name;

    switch (actionType) {
      case ActionType.START_GAME:
        return <TurnContainer key={`turn${index}`}><ActionLineContainer key={`start${index}`}>{`Game Started. Good luck, have fun!`}</ActionLineContainer></TurnContainer>
      case ActionType.JOIN_GAME:
        return null;
      case ActionType.TAKE_GEMS:
        return <TurnContainer key={`turn${index}`}>{this.renderTakeGems(index, playerName, actionLine.transferredGems)}</TurnContainer>
      case ActionType.PURCHASE_ACTIVE_CARD:
      case ActionType.PURCHASE_RESERVED_CARD:
        return <TurnContainer key={`turn${index}`}>{this.renderPurchaseCard(index, playerName, actionLine)}</TurnContainer>
      case ActionType.RESERVE_ACTIVE_CARD:
      case ActionType.RESERVE_DECK_CARD:
        return <TurnContainer key={`turn${index}`}>{this.renderReserveCard(index, playerName, actionLine)}</TurnContainer>
      case ActionType.NEW_ACTIVE_CARD:
        return <TurnContainer key={`turn${index}`}>{this.renderNewActiveCard(index, actionLine.card)}</TurnContainer>
      case ActionType.OBTAIN_NOBLE:
        return <TurnContainer key={`turn${index}`}>{this.renderObtainNoble(index, playerName, actionLine.obtainedNobles)}</TurnContainer>
      case ActionType.SKIP_TURN:
        return <TurnContainer key={`turn${index}`}>{this.renderSkipTurn(index, playerName)}</TurnContainer>
      case ActionType.LEAVE_GAME:
        return <TurnContainer key={`turn${index}`}>{this.renderLeaveGame(index, playerName)}</TurnContainer>
      case ActionType.DISCONNECTED:
        return <TurnContainer key={`turn${index}`}>{this.renderPlayerDisconnected(index, playerName)}</TurnContainer>
      case ActionType.DISCONNECTED_TIMEOUT:
        return <TurnContainer key={`turn${index}`}>{this.renderPlayerDisconnectedTimeout(index, playerName, actionLine.transferredGems)}</TurnContainer>
      case ActionType.RECONNECTED:
        return <TurnContainer key={`turn${index}`}>{this.renderPlayerReconnected(index, playerName)}</TurnContainer>
      case ActionType.GAME_ENDED:
        return <TurnContainer key={`turn${index}`}>{this.renderGameEnded(index, actionLine)}</TurnContainer>
    }
    return null;
  }

  renderTakeGems(index, playerName, transferredGems) {
    const takenGems = Object.keys(transferredGems)
      .reduce((map, key) => {
        if (transferredGems[key] >= 0) {
          map.set(key, transferredGems[key])
        }
        return map;
      }, new Map())
    const returnedGems = Object.keys(transferredGems)
      .reduce((map, key) => {
        if (transferredGems[key] < 0) {
          map.set(key, -1 * transferredGems[key])
        }
        return map;
      }, new Map())
    return [
      this.renderTakenGems(index, playerName, takenGems),
      this.renderReturnedGems(index, playerName, returnedGems),
    ]
  }

  renderPurchaseCard(index, playerName, actionLine) {
    return [
      this.renderPlayerCardAction(index, playerName, actionLine),
      this.renderReturnedGems(index, playerName, new Map(Object.entries(actionLine.transferredGems)))
    ]
  }

  renderReserveCard(index, playerName, actionLine) {
    return [
      this.renderPlayerCardAction(index, playerName, actionLine),
      this.renderTakeGems(index, playerName, actionLine.transferredGems),
    ]
  }

  renderPlayerCardAction(index, playerName, actionLine) {
    let from = null;
    let actionVerb = null;
    switch (actionLine.type) {
      case (ActionType.PURCHASE_ACTIVE_CARD):
        from = "from the board"
        actionVerb = "purchased a"
        break;
      case (ActionType.PURCHASE_RESERVED_CARD):
        from = "from their reserved cards"
        actionVerb = "purchased a"
        break;
      case (ActionType.RESERVE_ACTIVE_CARD):
        from = "from the board"
        actionVerb = "reserved a"
        break;
      case (ActionType.RESERVE_DECK_CARD):
        from = "from the deck"
        actionVerb = "reserved a"
        break;
    }

    return (
      <ActionLineContainer key={`${actionVerb}${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
        {actionVerb}
        {'\u00A0'}
        <InlineCard
          onMouseEnter={(el) => this.setState({ cardHover: actionLine.card, cardPosition: el.target.getBoundingClientRect() })}
        >
          card
        </InlineCard>
        {'\u00A0'}
        {from}
      </ActionLineContainer>
    )
  }

  renderNewActiveCard(index, newCard) {
    return (
      <ActionLineContainer key={`newactivecard${index}`}>
        A
        {'\u00A0'}
        <InlineCard
          onMouseEnter={(el) => this.setState({ cardHover: newCard, cardPosition: el.target.getBoundingClientRect() })}
        >
          card
        </InlineCard>
        {'\u00A0'}
        was flipped onto the board
      </ActionLineContainer>
    )
  }

  renderObtainNoble(index, playerName, obtainedNobles) {
    if (obtainedNobles.length > 0) {
      return (
        <ActionLineContainer key={`noble${index}`}>
          <PlayerName>{playerName}</PlayerName>
          {'\u00A0'}
          received
          {'\u00A0'}
          a
          {'\u00A0'}
          <InlineCard
            onMouseEnter={(el) => this.setState({ nobleHover: obtainedNobles[0], noblePosition: el.target.getBoundingClientRect() })}
          >
          noble
        </InlineCard>
        </ActionLineContainer>
      )
    }
    return null
  }

  renderSkipTurn(index, playerName) {
    return (
      <ActionLineContainer key={`skip${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
        skipped their turn
      </ActionLineContainer>
    )
  }

  renderPlayerDisconnected(index, playerName) {
    return (
      <ActionLineContainer key={`disconnected${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
        disconnected from the game. They have 1 minute to reconnect before their tokens will be returned to the board.
      </ActionLineContainer>
    )
  }

  renderPlayerDisconnectedTimeout(index, playerName, transferredGems) {
    return (
      <ActionLineContainer key={`reconnected${index}`}>
        <PlayerName>{playerName}</PlayerName>'s tokens have been returned.
        {this.renderReturnedGems(index, playerName, new Map(Object.entries(transferredGems)))}
        The player can still reconnect.
      </ActionLineContainer>
    )
  }

  renderPlayerReconnected(index, playerName) {
    return (
      <ActionLineContainer key={`reconnected${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
        reconnected to the game.
      </ActionLineContainer>
    )
  }

  renderLeaveGame(index, playerName) {
    return (
      <ActionLineContainer key={`leavegame${index}`}>
        <PlayerName>{playerName}</PlayerName>{'\u00A0'}left the game.
      </ActionLineContainer>
    )
  }

  renderGameEnded(index, actionLine) {
    return [
      actionLine.player && actionLine.player?.user?.name ?
        <ActionLineContainer key={`winner${index}`}>
          <PlayerName>{actionLine.player.user.name}</PlayerName>
          {'\u00A0'}
          won with
          {'\u00A0'}
          {actionLine.player.hand.score}
          {'\u00A0'}
          points!
        </ActionLineContainer>
        : null,
      <ActionLineContainer key={`end${index}`}>{`Game is completed. Thanks for playing!`}</ActionLineContainer>,
    ]
  }

  renderTakenGems(index, playerName, takenGems) {
    if (takenGems.size > 0) {
      return <ActionLineContainer key={`taken${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
        took
        {'\u00A0'}
        {this.renderGemsFromMap(takenGems)}
        {'\u00A0'}
        tokens
      </ActionLineContainer>
    }
    return null
  }

  renderReturnedGems(index, playerName, returnedGems) {
    if (returnedGems.size > 0) {
      return <ActionLineContainer key={`returned${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
        returned
        {'\u00A0'}
        {this.renderGemsFromMap(returnedGems)}
        {'\u00A0'}
        tokens
      </ActionLineContainer>
    }
    return null
  }

  renderGemsFromMap(gemsMap) {
    const gems = Array.from(gemsMap.keys())
      .filter((key) => gemsMap.get(key) !== 0)
      .map((key) => <GemStoneBaseContainer key={key} ><GemStoneBase type={key} amount={gemsMap.get(key)} width={0.75} height={0.75} fill="true" /></GemStoneBaseContainer>)
    return <GemsContainer>
      (
      {'\u00A0'}
      {gems}
      {'\u00A0'}
      )
    </GemsContainer>
  }

  render() {
    return (
      <ActionLogContainer width={this.props.width}>
        <ActionsContainer width={this.props.width} id="actions-container">
          {this.renderActionLines()}
        </ActionsContainer>
        {this.state.cardHover !== null ?
          <HoverCardContainer
            top={this.state.cardPosition.top}
            left={this.state.cardPosition.left}
            onMouseLeave={() => this.setState({ cardHover: null, cardPosition: null })}
          >
            <Card card={this.state.cardHover} width={theme.card.width} height={theme.card.height} />
          </HoverCardContainer>
          : null
        }
        {this.state.nobleHover !== null ?
          <HoverCardContainer
            top={this.state.noblePosition.top}
            left={this.state.noblePosition.left}
            onMouseOut={() => this.setState({ nobleHover: null, noblePosition: null })}
          >
            <Noble noble={this.state.nobleHover} width={theme.card.width} height={theme.card.width} />
          </HoverCardContainer>
          : null
        }
      </ActionLogContainer>
    )
  }

}

export default ActionLog
