import React from 'react'
import styled from 'styled-components'
import theme from '../styledcomponents/theme.jsx'
import {ActionType} from '../enums/actiontype'
import { GemStoneBase } from './GemStone.jsx'
import Card from './Card.jsx'
import Noble from './Noble.jsx'

const ActionLogContainer = styled.div`
  width: ${ props => `${props.width}rem`};
  height: ${ props => `${props.height}rem`};
  padding: 0.5rem;
`
const ActionLineContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-flow: row wrap;
`
const GemsContainer = styled.span`
  display: flex;
  flex-flow: row wrap;
  background-color: ${ props => props.theme.color.black};
  color: white;
`

class ActionLog extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
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
  }

  renderActionLines() {
    const actions = this.props.actionLog.map((actionLine, index) => this.renderActionLine(actionLine, index));
    return actions;
  }

  renderActionLine(actionLine, index) {
    const actionType = actionLine.type;
    const playerName = actionLine.player?.user?.name;

    switch (actionType) {
      case ActionType.START_GAME:
        return <ActionLineContainer key={`start${index}`}>{`Game Started. Good luck, have fun!`}</ActionLineContainer>
      case ActionType.JOIN_GAME:
        return null;
      case ActionType.TAKE_GEMS:
        return this.renderTakeGems(index, playerName, actionLine.transferredGems)
      case ActionType.PURCHASE_ACTIVE_CARD:
      case ActionType.PURCHASE_RESERVED_CARD:
        return this.renderPurchaseCard(index, playerName, actionLine)
      case ActionType.RESERVE_ACTIVE_CARD:
      case ActionType.RESERVE_DECK_CARD:
        return this.renderReserveCard(index, playerName, actionLine)
      case ActionType.NEW_ACTIVE_CARD:
        return this.renderNewActiveCard(index, actionLine.card)
      case ActionType.OBTAIN_NOBLE:
        return this.renderObtainNoble(index, playerName, actionLine.obtainedNobles)
      case ActionType.SKIP_TURN:
        return this.renderSkipTurn(index, playerName)
      case ActionType.LEAVE_GAME:
        return this.renderLeaveGame(index, playerName)
      case ActionType.GAME_ENDED:
        return this.renderGameEnded(index, actionLine)
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
    const card = <Card card={actionLine.card} width={1.5} height={2} doNotRenderRequired={"true"}/>
    return [
      <ActionLineContainer key={`purchased${index}`}>
        {playerName}
        {'\u00A0'}
        purchased
        {'\u00A0'}
        {card}
        {'\u00A0'}
        {actionLine.type === ActionType.PURCHASE_RESERVED_CARD ? "from their reserved cards" : "from the board"}
      </ActionLineContainer>,
      this.renderReturnedGems(index, playerName, new Map(Object.entries(actionLine.transferredGems)))
    ]
  }

  renderReserveCard(index, playerName, actionLine) {
    // TODO: Make a better icon. Click/hover to see actual card.
    const card = <Card card={actionLine.card} width={1.5} height={2} doNotRenderRequired={"true"}/>
    return [
      <ActionLineContainer key={`reserved${index}`}>
        {playerName}
        {'\u00A0'}
        reserved
        {'\u00A0'}
        {card}
        {'\u00A0'}
        {actionLine.type === ActionType.RESERVE_DECK_CARD ? "from the deck" : "from the board"}
      </ActionLineContainer>,
      this.renderTakeGems(index, playerName, actionLine.transferredGems),
    ]
  }

  renderNewActiveCard(index, newCard) {
    // TODO: Make a better icon. Click/hover to see actual card.
    const card = <Card card={newCard} width={1.5} height={2} doNotRenderRequired={"true"}/>
    return (
      <ActionLineContainer key={`newactivecard${index}`}>
        {card}
        {'\u00A0'}
        was flipped onto the board
      </ActionLineContainer>
    )
  }

  renderObtainNoble(index, playerName, obtainedNobles) {
    // TODO: Make a better icon. Click/hover to see actual noble.
    const nobles = obtainedNobles.map((noble) => <Noble key={noble.id} noble={noble} width={1.5} height={2}/>)
    if(nobles.length > 0) {
      return (
        <ActionLineContainer key={`noble${index}`}>
          {playerName}
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
        {playerName}
        {'\u00A0'}
        skipped their turn
      </ActionLineContainer>
    )
  }

  renderLeaveGame(index, playerName) {
    return (
      <ActionLineContainer key={`leavegame${index}`}>
      {playerName}
      {'\u00A0'}
      disconnected from the game
    </ActionLineContainer>
    )
  }

  renderGameEnded(index, actionLine) {
    let winner = null;
    if(actionLine.player) {
      winner = `${actionLine.player.user.name} has won with ${actionLine.player.hand.score} points!`
    }

    return [
      winner ? <ActionLineContainer key={`winner${index}`}>{winner}</ActionLineContainer> : null,
      <ActionLineContainer key={`end${index}`}>{`Game has ended. Thanks for playing!`}</ActionLineContainer>,
    ]
  }

  renderTakenGems(index, playerName, takenGems) {
    if(takenGems.size > 0) {
      return <ActionLineContainer key={`taken${index}`}>{playerName}{'\u00A0'}took{'\u00A0'}{this.renderGemsFromMap(takenGems)}{'\u00A0'}tokens</ActionLineContainer>
    }
    return null
  }

  renderReturnedGems(index, playerName, returnedGems) {
    if(returnedGems.size > 0) {
      return <ActionLineContainer key={`returned${index}`}>{playerName}{'\u00A0'}returned{'\u00A0'}{this.renderGemsFromMap(returnedGems)}{'\u00A0'}tokens</ActionLineContainer>
    }
    return null
  }

  renderGemsFromMap(gemsMap) {
    const gems = Array.from(gemsMap.keys())
      .filter((key) => gemsMap.get(key) !== 0)
      .map((key) => <GemStoneBase key={key} type={key} amount={gemsMap.get(key)} width={1} height={1} fill="true"/>)
    return <GemsContainer>({'\u00A0'}{gems}{'\u00A0'})</GemsContainer>
  }

  render() {
    return (
      <ActionLogContainer width={this.props.width} height={this.props.height}>
        {this.renderActionLines()}
      </ActionLogContainer>
    )
  }

}

export default ActionLog
