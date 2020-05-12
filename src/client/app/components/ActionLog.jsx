import React from 'react'
import styled from 'styled-components'
import theme from '../styledcomponents/theme.jsx'
import {ActionType} from '../enums/actiontype'
import { GemStoneBase } from './GemStone.jsx'

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
    this.renderGemsFromMap = this.renderGemsFromMap.bind(this)
  }

  renderActionLines() {
    const actions = this.props.actionLog.map((actionLine, index) => this.renderActionLine(actionLine, index));
    return actions;
  }

  renderActionLine(actionLine, index) {
    const actionType = actionLine.type;
    const playerName = actionLine.player?.user?.name;

    switch(actionType) {
      case ActionType.START_GAME:
        return <ActionLineContainer key={`log${index}`}>{`Game Started. Good luck, have fun!`}</ActionLineContainer>
      case ActionType.JOIN_GAME:
        return null;
      case ActionType.TAKE_GEMS:
        return this.renderTakeGems(index, playerName, actionLine.transferredGems);
      case ActionType.PURCHASE_ACTIVE_CARD:
      case ActionType.PURCHASE_RESERVED_CARD:
      case ActionType.RESERVE_ACTIVE_CARD:
      case ActionType.RESERVE_DECK_CARD:
      case ActionType.NEW_ACTIVE_CARD:
      case ActionType.OBTAIN_NOBLE:
      case ActionType.SKIP_TURN:
      case ActionType.LEAVE_GAME:
      case ActionType.GAME_ENDED:
        break;
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
          map.set(key, -1*transferredGems[key])
        }
        return map;
      }, new Map())
    if(takenGems.size > 0 && returnedGems.size > 0) {
      return [
        this.renderTakenGems(index, playerName, takenGems),
        this.renderReturnedGems(index, playerName, returnedGems),
      ]
    } else if(takenGems.size > 0) {
      return this.renderTakenGems(index, playerName, takenGems);
    } else if(returnedGems.size > 0) {
      return this.renderReturnedGems(index, playerName, returnedGems);
    } else {
      return <ActionLineContainer key={index}/>
    }
  }

  renderTakenGems(index, playerName, takenGems) {
    if(takenGems.size > 0) {
      return <ActionLineContainer key={`taken${index}`}>{playerName}{'\u00A0'}took{'\u00A0'}{this.renderGemsFromMap(takenGems)}{'\u00A0'}tokens.</ActionLineContainer>
    }
    return null
  }

  renderReturnedGems(index, playerName, returnedGems) {
    if(returnedGems.size > 0) {
      return <ActionLineContainer key={`returned${index}`}>{playerName}{'\u00A0'}returned{'\u00A0'}{this.renderGemsFromMap(returnedGems)}{'\u00A0'}tokens.</ActionLineContainer>
    }
    return null
  }

  renderGemsFromMap(gemsMap) {
    const gems = Array.from(gemsMap.keys())
      .map((key) => <GemStoneBase key={key} type={key} amount={gemsMap.get(key)} width={1} height={1} fill="true"/>)
    return <GemsContainer>({'\u00A0'}{gems}{'\u00A0'})</GemsContainer>
  }

  render() {
    return (
      <ActionLogContainer width={this.props.width} height={this.props.height}>
        ActionLogComponent
        {this.renderActionLines()}
      </ActionLogContainer>
    )
  }

}

export default ActionLog
