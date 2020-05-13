import React from 'react';
import styled from 'styled-components'
import Button from '../styledcomponents/button.jsx'
import Board from './Board.jsx'
import Player from './Player.jsx'
import { deserialize } from 'bson'
import { socket } from '../socket'
import { ActionType } from '../enums/actiontype'
import theme from '../styledcomponents/theme.jsx'
import Overlay from '../styledcomponents/overlay.jsx'
import Modal from '../styledcomponents/modal.jsx'
import OutsideAlerter from './modals/OutsideAlerter.jsx'
import RulesModal from './modals/RulesModal.jsx'
import Actionlog from './ActionLog.jsx'
import Timer from './Timer.jsx'

const GameContainer = styled.div`
  margin: 1rem 0.5rem 2rem 0.5rem;
  min-width: ${ props => `${props.theme.card.width * 5 + props.theme.card.spaceBetween * 10}rem`};
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ActionsContainer = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: row;
`
const PlayerTurnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: center;
  font-family: ${ props => props.theme.fontFamily.tertiary};
  font-weight: 300;
  color: ${ props => props.theme.color.darkgrey};
  padding-right: 1rem;
  width: ${ props => `${props.theme.actionLog.width}rem`};
`
const TurnDiv = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`
const TurnName = styled.span`
  color: ${ props => props.theme.color.secondary};
  font-weight: bold;
`
const Rules = styled.div`
  color: ${ props => props.theme.color.tertiary};
  background-color: ${ props => props.theme.color.white};
  border: 1px solid ${ props => props.theme.color.tertiary};
  padding: 0.25rem 0.5rem;
  margin: 0.5rem 0rem;
  width: 5rem;
  cursor: pointer;
  text-align: center;
  &:hover {
    color: ${ props => props.theme.color.white};
    background-color: ${ props => props.theme.color.tertiary};
  }
`

const WinnerScreen = styled.div`
  margin-top: 0.5rem;
  font-family: ${ props => props.theme.fontFamily.tertiary};
  background: ${ props => props.theme.color.grey};
  z-index: 5;
  text-align: center;
  color: white;
  width: 100%;
`

const BoardPlayerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  background: ${ props => props.theme.color.white};
`
const Title = styled.div`
  text-align: center;
  text-decoration: underline;
  font-weight: 300;
  margin: 0.5rem 0rem;
  font-size: 2rem;
`
const BoardContainer = styled.div`
  margin: 0rem 1rem;
`
const PlayersContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin: 0rem 1rem;
`
const PlayerContainer = styled.div`
  order: ${ props => props.order ?? 0};
`

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      actionLog: [],
      board: {},
      isMyTurn: false,
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
        minutes: 2,
        seconds: 0,
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
    this.renderHands = this.renderHands.bind(this)
    this.onHackNobles = this.onHackNobles.bind(this)
    this.onRulesClick = this.onRulesClick.bind(this)
    this.onRulesClosed = this.onRulesClosed.bind(this)
    this.onLeaveGame = this.onLeaveGame.bind(this);
  }

  componentDidMount() {
    window.onpopstate = () => { } // TODO: This is a hack. Figure out a way to register back button properly in WaitingRoom.jsx
    this.socket.on('UpdateGame', this.onGameUpdate)
    this.socket.on('ClientRequestError', this.onClientRequestError)
    this.socket.emit('RequestGameUpdate', { gameID: this.state.gameID, playerID: this.state.playerID })
  }

  componentWillUnmount() {
    this.onLeaveGame();
    this.socket.off('UpdateGame', this.onGameUpdate)
    this.socket.off('ClientRequestError', this.onClientRequestError)
  }

  onGameUpdate(data) {
    const game = deserialize(Buffer.from(data));
    const players = game.room.players;
    const player = players[this.state.playerID];
    const board = game.board;
    const curPlayerTurn = players[game.turnOrder[game.curTurnIndex]];
    const isMyTurn = curPlayerTurn.id === player.id;

    this.setState({
      actionLog: game.actionLog,
      actionData: null,
      actionType: null,
      curTurnIndex: game.curTurnIndex,
      gameTurn: game.gameTurn,
      targetScore: game.targetScore,
      turnOrder: game.turnOrder,
      winner: game.winner,
      tieBreakerMoreRounds: game.tieBreakerMoreRounds,
      board: board,
      isMyTurn: isMyTurn,
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
      .map((player) => (
        <PlayerContainer key={player.id} order={this.state.turnOrder.indexOf(player.id)}>
          <Player
            isMyHand={player.id === this.state.playerID}
            isThisPlayerTurn={player.id === this.state.turnOrder[this.state.curTurnIndex]}
            player={player}
            width={theme.card.icon.width * 6 + theme.card.spaceBetween * 12 + 2}
            handlePurchaseCard={this.onPurchaseReservedCard}
            isMyTurn={this.state.isMyTurn}
          />
        </PlayerContainer>
      ))
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
    console.log("Skipping turn")
    if (this.state.isMyTurn) {
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

  onLeaveGame() {
    this.socket.emit('LeftGame', {
      gameID: this.state.gameID,
      playerID: this.state.playerID,
    });
    this.props.history.push('/')
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
    const Turn = () => (this.state.isMyTurn
      ? <TurnDiv>It is <TurnName>your</TurnName> turn!</TurnDiv>
      : <TurnDiv>It is <TurnName>{this.state.players[this.state.turnOrder[this.state.curTurnIndex]]?.user?.name}'s</TurnName> turn</TurnDiv>
    );
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
        <ActionsContainer>
          <PlayerTurnContainer>
            <Turn />
            <Timer handleSkipTurn={this.onSkipTurn} isMyTurn={this.state.isMyTurn}/>
            <Rules onClick={this.onRulesClick}>Rules <span><i className="fa fa-info-circle"></i></span></Rules>
          </PlayerTurnContainer>
          <Actionlog
            actionLog={this.state.actionLog}
            width={theme.actionLog.width}
            height={theme.actionLog.height}
          />
        </ActionsContainer>
        {this.state.winner && !this.state.tieBreakerMoreRounds
          ? <Winner />
          : null
        }
        <BoardPlayerContainer>
          <BoardContainer>
            <Title>Board</Title>
            <Board
              board={this.state.board}
              hand={this.state.player?.hand}
              isPlayerTurn={this.state.isMyTurn}
              onPurchaseCard={this.onPurchaseActiveCard}
              onPurchaseTokens={this.onPurchaseTokens}
              onReserveCard={this.onReserveActiveCard}
              onReserveTierCard={this.onReserveTierCard}
            />
          </BoardContainer>
          <PlayersContainer><Title order={-1}>Players</Title>{this.renderHands()}</PlayersContainer>
          <InvalidInputError />
        </BoardPlayerContainer>
        {this.state.isMyTurn ? <Button onClick={this.onSkipTurn} color={theme.color.tertiary}>Skip Turn</Button> : null}
        {this.state.winner && !this.state.tieBreakerMoreRounds ?
          <Button
            color={theme.color.error}
            onClick={this.onLeaveGame}>
            Leave Game
          </Button>
          : null
        }
        <Button
          color={theme.color.error}
          onClick={this.onHackNobles}>
          Hack Nobles
          </Button>
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
