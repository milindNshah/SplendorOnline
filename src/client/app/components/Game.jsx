import React from 'react';
import styled from 'styled-components'
import Button from '../styledcomponents/button.jsx'
import Board from './Board.jsx';
import Player from './Player.jsx';
import { deserialize } from 'bson';
import { socket } from '../socket';
import { ActionType } from '../enums/actiontype';
import theme from '../styledcomponents/theme.jsx'
import Overlay from '../styledcomponents/overlay.jsx'
import Modal from '../styledcomponents/modal.jsx'
import OutsideAlerter from './modals/OutsideAlerter.jsx'
import RulesModal from './modals/RulesModal.jsx'

const GameContainer = styled.div`
  margin: 1rem 0.5rem 2rem 0.5rem;
  min-width: ${ props => `${props.theme.card.width * 5 + props.theme.card.spaceBetween * 10}rem`};
`
const BoardPlayerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background: ${ props => props.theme.color.white};
`
const BoardContainer = styled.div`
  padding: 1rem;
`
const PlayersContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  padding: 1rem;
`
const ButtonContainer = styled.div`
  text-align: center;
`
const Title = styled.h1`
  text-align: center;
  text-decoration: underline;
  font-weight: 300;
`
const Scorebox = styled.div`
  margin-bottom: 1rem;
  text-align: center;
`
const TargetScore = styled.p`
  color: ${ props => props.theme.color.error};
`
const TurnName = styled.span`
  color: ${ props => props.theme.color.secondary};
  font-weight: bold;
`
const TimerContainer = styled.div`
  display: flex;
  justify-content: center;
`
const Time = styled.span`
  color: ${ props => props.minutes === 0 && props.seconds <= 15 ? props.theme.color.error : props.theme.color.black};
  border: 1px solid ${ props => props.minutes === 0 && props.seconds <= 15 ? props.theme.color.error : props.theme.color.black};
  font-size: 1.5rem;
  font-family: ${ props => props.theme.fontFamily.secondary};
  padding: 0.25rem 0rem;
  width: 5rem;
`
const Rules = styled.div`
  color: ${ props => props.theme.color.primary };
  background-color: ${ props=> props.theme.color.white };
  border: 1px solid ${ props => props.theme.color.primary };
  padding: 0.25rem 0.5rem;
  width: 5rem;
  cursor: pointer;
  &:hover {
    color: ${ props=> props.theme.color.white };
    background-color: ${ props => props.theme.color.primary };
  }
`
const RulesContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0rem;
`
const WinnerScreen = styled.div`
  margin-top: 1rem;
  background: ${ props => props.theme.color.grey};
  z-index: 5;
  display: flex;
  text-align: center;
  justify-content: center;
  color: white;
`

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      board: {},
      isPlayerTurn: false,
      curTurnIndex: 0,
      invalidInputError: null,
      serverError: null,
      gameID: this.props.gameID,
      gameTurn: 0,
      player: {},
      playerID: this.props.playerID,
      players: [],
      targetScore: null,
      tieBreakerMoreRounds: false,
      turnOrder: [],
      winner: null,
      actionType: null,
      actionData: null,
      rulesClicked: false,
      timeleft: {
        minutes: 1,
        seconds: 30,
      },
    }
    this.socket = socket;
    this.onClientRequestError = this.onClientRequestError.bind(this)
    this.onEndTurn = this.onEndTurn.bind(this)
    this.onGameUpdate = this.onGameUpdate.bind(this)
    this.onPurchaseActiveCard = this.onPurchaseActiveCard.bind(this)
    this.onPurchaseReservedCard = this.onPurchaseReservedCard.bind(this)
    this.onPurchaseTokens = this.onPurchaseTokens.bind(this)
    this.onReserveActiveCard = this.onReserveActiveCard.bind(this)
    this.onReserveTierCard = this.onReserveTierCard.bind(this)
    this.onSkipTurn = this.onSkipTurn.bind(this)
    this.onTimerUpdate = this.onTimerUpdate.bind(this)
    this.renderHands = this.renderHands.bind(this)
    this.onHackNobles = this.onHackNobles.bind(this)
    this.onRulesClick = this.onRulesClick.bind(this)
    this.onRulesClosed = this.onRulesClosed.bind(this)
  }

  componentDidMount() {
    this.socket.on('UpdateGame', this.onGameUpdate);
    this.socket.on('ClientRequestError', this.onClientRequestError);
    this.socket.on('TimerUpdate', this.onTimerUpdate)
    this.socket.emit('RequestGameUpdate', this.state.gameID);
  }

  componentWillUnmount() {
    this.socket.off('UpdateGame', this.onGameUpdate);
    this.socket.off('ClientRequestError', this.onClientRequestError);
    this.socket.off('TimerUpdate', this.onTimerUpdate);
  }

  onTimerUpdate(data) {
    this.setState({
      timeleft: data,
    })
    if (data.seconds === 0 && data.minutes === 0 && this.state.isPlayerTurn) {
      this.onSkipTurn();
    }
  }

  onGameUpdate(data) {
    const game = deserialize(Buffer.from(data));
    const players = game.room.players;
    const player = players[this.state.playerID];
    const board = game.board;
    const curPlayerTurn = players[game.turnOrder[game.curTurnIndex]];
    const isPlayerTurn = curPlayerTurn.id === player.id;

    this.setState({
      actionType: null,
      actionData: null,
      curTurnIndex: game.curTurnIndex,
      gameTurn: game.gameTurn,
      targetScore: game.targetScore,
      turnOrder: game.turnOrder,
      winner: game.winner,
      tieBreakerMoreRounds: game.tieBreakerMoreRounds,
      board: board,
      isPlayerTurn: isPlayerTurn,
      player: player,
      players: players,
      serverError: null,
    });
  }

  onClientRequestError(err) {
    this.setState({
      serverError: err,
    });
  }

  onRulesClick() {
    this.setState({
      rulesClicked: true,
    })
  }

  onRulesClosed() {
    this.setState({
      rulesClicked: false,
    })
  }

  renderHands() {
    if (!this.state.players) {
      return;
    }
    const hands = Object.values(this.state.players)
      .map((player) => <Player
        isMyHand={player.id === this.state.playerID}
        key={player.id}
        player={player}
        width={theme.card.icon.width * 6 + theme.card.spaceBetween * 12 + 2}
        handlePurchaseCard={this.onPurchaseReservedCard}
        isPlayerTurn={this.state.isPlayerTurn}
      />)
    return (hands)
  }

  onPurchaseReservedCard(card) {
    this.setState({
      actionData: card.id,
      actionType: ActionType.PURCHASE_RESERVED_CARD,
    }, this.onEndTurn)
  }

  onPurchaseTokens(tokensTaken, tokensReturned) {
    const tokens = new Map()
    tokensTaken.forEach((amount, gemStone) => {
      tokens.set(gemStone, amount);
    })
    tokensReturned.forEach((amount, gemStone) => {
      if (tokens.has(gemStone)) {
        tokens.set(gemStone, tokens.get(gemStone) - amount)
      } else {
        tokens.set(gemStone, -1 * amount)
      }
    })
    const tokenObject = Array.from(tokens.keys())
      .reduce((acc, gemStone) => {
        acc[gemStone] = tokens.get(gemStone)
        return acc;
      }, {})
    this.setState({
      actionData: tokenObject,
      actionType: ActionType.TAKE_GEMS,
    }, this.onEndTurn)
  }

  onPurchaseActiveCard(card) {
    this.setState({
      actionData: card.id,
      actionType: ActionType.PURCHASE_ACTIVE_CARD,
    }, this.onEndTurn)
  }

  onReserveActiveCard(card, returnedToken) {
    this.setState({
      actionData: { cardID: card.id, returnedToken: returnedToken },
      actionType: ActionType.RESERVE_ACTIVE_CARD,
    }, this.onEndTurn)
  }

  onReserveTierCard(tier, returnedToken) {
    this.setState({
      actionData: { tier: tier, returnedToken: returnedToken },
      actionType: ActionType.RESERVE_DECK_CARD,
    }, this.onEndTurn)
  }

  onHackNobles() {
    this.setState({
      actionData: {},
      actionType: "hackForNobles"
    }, this.onEndTurn)
  }

  onSkipTurn() {
    if (this.state.isPlayerTurn) {
      this.setState({
        actionData: null,
        actionType: ActionType.SKIP_TURN,
      }, this.onEndTurn)
    }
  }

  onEndTurn() {
    const actions = { [this.state.actionType]: this.state.actionData }
    this.socket.emit("EndTurn", {
      actions: actions,
      gameID: this.state.gameID,
      playerID: this.state.playerID,
    })
  }

  render() {
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <p>Invalid Input: {this.state.invalidInputError}</p>
        : null
    );
    const ServerError = () => (
      (this.state.serverError && !this.state.invalidInputError)
        ? <p>Server Error: {this.state.serverError.message}</p>
        : null
    );

    const Turn = () => (this.state.isPlayerTurn
      ? <h2>It is <TurnName>your</TurnName> turn!</h2>
      : <h2>It is <TurnName>{this.state.players[this.state.turnOrder[this.state.curTurnIndex]]?.user?.name}'s</TurnName> turn</h2>
    );

    const Timer = () => (this.state.timeleft.minutes === 0 && this.state.timeleft.seconds === 0
      ? <Time seconds={this.state.timeleft.seconds} minutes={this.state.timeleft.minutes}>0:00</Time>
      : <Time seconds={this.state.timeleft.seconds} minutes={this.state.timeleft.minutes}>
        {this.state.timeleft.minutes}:{this.state.timeleft.seconds < 10 ? `0${this.state.timeleft.seconds}` : this.state.timeleft.seconds}
      </Time>
    )

    const Winner = () => (this.state.winner.id === this.state.playerID
      ? <WinnerScreen><h1>Congratulations <TurnName>you</TurnName> win!</h1></WinnerScreen>
      : <WinnerScreen><h1><TurnName>{this.state.winner.user.name}</TurnName> has won with {this.state.winner.hand.score} points</h1></WinnerScreen>
    );

    return (
      <GameContainer>
        {this.state.rulesClicked
          ? <Overlay></Overlay>
          : null
        }
        <Scorebox>
          <Turn />
          <TargetScore>TargetScore: <b>{this.state.targetScore}</b></TargetScore>
          <p>Turn: {this.state.gameTurn}</p>
          <TimerContainer><Timer /></TimerContainer>
          {this.state.winner && !this.state.tieBreakerMoreRounds
            ? <Winner />
            : null
          }
          <RulesContainer><Rules onClick={this.onRulesClick}>Rules <span><i className="fa fa-info-circle"></i></span></Rules></RulesContainer>
        </Scorebox>
        <BoardPlayerContainer>
          <BoardContainer>
            <Title>Board</Title>
            <Board
              board={this.state.board}
              hand={this.state.player?.hand}
              isPlayerTurn={this.state.isPlayerTurn}
              onPurchaseCard={this.onPurchaseActiveCard}
              onPurchaseTokens={this.onPurchaseTokens}
              onReserveCard={this.onReserveActiveCard}
              onReserveTierCard={this.onReserveTierCard}
            />
          </BoardContainer>
          <PlayersContainer><Title>Players</Title>{this.renderHands()}</PlayersContainer>
          <InvalidInputError />
          {/* <ServerError /> */}
        </BoardPlayerContainer>
        {this.state.isPlayerTurn ? <ButtonContainer><Button onClick={this.onSkipTurn} color={theme.color.error}>Skip Turn</Button></ButtonContainer> : null}
        <ButtonContainer><Button onClick={this.onHackNobles}>Hack Nobles</Button></ButtonContainer>
        {this.state.rulesClicked ?
          <Modal>
            <OutsideAlerter handleClose={this.onRulesClosed}>
              <RulesModal
                handleClose={this.onRulesClosed}
              />
            </OutsideAlerter>
          </Modal>
          : null
        }
      </GameContainer>
    )
  }
}

export default Game;
