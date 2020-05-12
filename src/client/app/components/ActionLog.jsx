import React from 'react'
import styled from 'styled-components'
import theme from '../styledcomponents/theme.jsx'
import { ActionType } from '../enums/actiontype'
import { GemStoneBase } from './GemStone.jsx'
// import Card from './Card.jsx'
import Noble from './Noble.jsx'

const ActionLogContainer = styled.div`
  font-family: ${ props => props.theme.fontFamily.secondary};
  border-right: 2px solid ${ props => props.theme.color.secondary};
  width: ${ props => `${props.width}rem`};
  text-align: end;
`
const ActionsContainer = styled.div`
  padding: 1rem;
  height: ${ props => `${props.height}rem`};
  overflow: scroll;
`
const TurnContainer = styled.div`
  border-bottom: 1px solid ${ props => props.theme.color.lightgrey };
  margin: 0.5rem 0rem;
`
const ActionLineContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-flow: row wrap;
  margin: 0.5rem 0rem;
`
const GemsContainer = styled.span`
  display: flex;
  flex-flow: row wrap;
  background-color: ${ props => props.theme.color.black};
  color: white;
`
const GemStoneBaseContainer = styled.div`
  margin: 0rem 0.25rem;
`
const PlayerName = styled.span`
  color: ${ props => props.theme.color.secondary };
`
const Title = styled.span`
  padding-right: 1rem;
  color: ${ props => props.theme.color.secondary };
  font-size: 1rem;
  text-decoration: underline;
  font-weight: 700;
`
const InlineCard = styled.div`
  background-color: ${props => props.theme.color.black};
  padding: 0rem 0.25rem;
  color: ${ props => props.theme.color.white };
  text-decoration: underline;
`

class ActionLog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cardHover: null,
      nobleHover: null,
    }
    // TODO: Why does this scroll entire page. Figure out how to only scroll the actionLog box.
    // this.actionsEndRef = React.createRef()
    this.renderActionLines = this.renderActionLines.bind(this)
    this.renderActionLine = this.renderActionLine.bind(this)
    this.renderTakeGems = this.renderTakeGems.bind(this)
    this.renderPurchaseCard = this.renderPurchaseCard.bind(this)
    this.renderReserveCard = this.renderReserveCard.bind(this)
    this.renderNewActiveCard = this.renderNewActiveCard.bind(this)
    this.renderObtainNoble = this.renderObtainNoble.bind(this)
    this.renderSkipTurn = this.renderSkipTurn.bind(this)
    this.renderLeaveGame = this.renderLeaveGame.bind(this)
    this.renderTakenGems = this.renderTakenGems.bind(this)
    this.renderReturnedGems = this.renderReturnedGems.bind(this)
    this.renderGemsFromMap = this.renderGemsFromMap.bind(this)
    // this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  // componentDidMount () {
  //   this.scrollToBottom()
  // }
  // componentDidUpdate () {
  //   this.scrollToBottom()
  // }

  // scrollToBottom() {
  //   this.actionsEndRef.current.scrollIntoView({ behavior: "smooth" });
  // }

  renderActionLines() {
    const actions = this.props.actionLog.map((actionLine, index) => this.renderActionLine(actionLine, index));
    return <div>
      {actions}
      {/* <div ref={this.actionsEndRef} /> */}
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
    // TODO: Make a better icon. Click/hover to see actual card.
    // const card = <Card card={actionLine.card} width={1.5} height={2} doNotRenderRequired={"true"} />
    return [
      <ActionLineContainer key={`purchased${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
        purchased
        {'\u00A0'}
        <InlineCard>a card</InlineCard>
        {'\u00A0'}
        {actionLine.type === ActionType.PURCHASE_RESERVED_CARD ? "from their reserved cards" : "from the board"}
      </ActionLineContainer>,
      this.renderReturnedGems(index, playerName, new Map(Object.entries(actionLine.transferredGems)))
    ]
  }

  renderReserveCard(index, playerName, actionLine) {
    // TODO: Make a better icon. Click/hover to see actual card.
    // const card = <Card card={actionLine.card} width={1.5} height={2} doNotRenderRequired={"true"} />
    return [
      <ActionLineContainer key={`reserved${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
        reserved
        {'\u00A0'}
        <InlineCard>a card</InlineCard>
        {'\u00A0'}
        {actionLine.type === ActionType.RESERVE_DECK_CARD ? "from the deck" : "from the board"}
      </ActionLineContainer>,
      this.renderTakeGems(index, playerName, actionLine.transferredGems),
    ]
  }

  renderNewActiveCard(index, newCard) {
    // TODO: Make a better icon. Click/hover to see actual card.
    // const card = <Card card={newCard} width={1.5} height={2} doNotRenderRequired={"true"} />

    return (
      <ActionLineContainer key={`newactivecard${index}`}>
        <InlineCard
          onMouseEnter={() => this.setState({ cardHover: newCard })}
          onMouseLeave={() => this.setState({ cardHover: null })}
        >
          A card
        </InlineCard>
        {'\u00A0'}
        was flipped onto the board
      </ActionLineContainer>
    )
  }

  renderObtainNoble(index, playerName, obtainedNobles) {
    // TODO: Make a better icon. Click/hover to see actual noble.
    const nobles = obtainedNobles.map((noble) => <Noble key={noble.id} noble={noble} width={1.5} height={2} />)
    if (nobles.length > 0) {
      return (
        <ActionLineContainer key={`noble${index}`}>
          <PlayerName>{playerName}</PlayerName>
          {'\u00A0'}
          received
          {'\u00A0'}
          <GemsContainer>{nobles}</GemsContainer>
          {'\u00A0'}
          nobles
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

  renderLeaveGame(index, playerName) {
    return (
      <ActionLineContainer key={`leavegame${index}`}>
        <PlayerName>{playerName}</PlayerName>
        {'\u00A0'}
      disconnected from the game
      </ActionLineContainer>
    )
  }

  renderGameEnded(index, actionLine) {
    return [
      actionLine.player && actionLine.player?.user?.name ?
        <ActionLineContainer key={`winner${index}`}>
          <PlayerName>{actionLine.player.user.name}</PlayerName>
          {'\u00A0'}
          has won with
          {'\u00A0'}
          {actionLine.player.hand.score}
          {'\u00A0'}
          points!
        </ActionLineContainer>
        : null,
      <ActionLineContainer key={`end${index}`}>{`Game has ended. Thanks for playing!`}</ActionLineContainer>,
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
      .map((key) => <GemStoneBaseContainer><GemStoneBase key={key} type={key} amount={gemsMap.get(key)} width={1} height={1} fill="true" /></GemStoneBaseContainer>)
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
      <ActionLogContainer width={this.props.width} height={this.props.height}>
        <Title>Action Log</Title>
        <ActionsContainer width={this.props.width} height={this.props.height}>
          {this.renderActionLines()}
        </ActionsContainer>
      </ActionLogContainer>
    )
  }

}

export default ActionLog
