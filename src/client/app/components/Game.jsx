import React from 'react';
import styled from 'styled-components'
import Button from '../styledcomponents/button.jsx'
import Board from './Board.jsx'
import Player from './Player.jsx'
import { Buffer } from 'buffer';
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
import GemStoneTokens from './GemStoneTokens.jsx'
import { CopyToClipboard } from 'react-copy-to-clipboard';

const GameContainer = styled.div`
  margin: 1rem 0.5rem 2rem 0.5rem;
  min-width: ${ props => `${props.theme.card.width * 5 + props.theme.card.spaceBetween * 10}rem`};
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CopyCodeContainer = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  color: ${ props => props.theme.color.secondary};
  background-color: ${ props => props.theme.color.white};
  border: 1px solid ${ props => props.theme.color.secondary};
  padding: 0.25rem 0.5rem;
  width: 5rem;
  cursor: pointer;
  text-align: center;
  font-family: ${ props => props.theme.fontFamily.secondary};
  &:hover {
    color: ${ props => props.theme.color.white};
    background-color: ${ props => props.theme.color.secondary};
  }

  @media (max-width: 42rem) {
    display: none;
  }
`
const ClipBoard = styled.span`
  margin-left: 0.5rem;
`
const Rules = styled.div`
  position: absolute;
  top: 3rem;
  right: 1rem;
  color: ${ props => props.theme.color.tertiary};
  background-color: ${ props => props.theme.color.white};
  border: 1px solid ${ props => props.theme.color.tertiary};
  padding: 0.25rem 0.5rem;
  width: 5rem;
  cursor: pointer;
  text-align: center;
  &:hover {
    color: ${ props => props.theme.color.white};
    background-color: ${ props => props.theme.color.tertiary};
  }

  @media (max-width: 42rem) {
    display: none;
  }
`

const PlayerTurnContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: ${ props => props.theme.color.darkgrey};
  margin-bottom: 0.5rem;
  z-index: 2;
`
const TurnDiv = styled.div`
  font-family: ${ props => props.theme.fontFamily.tertiary};
  font-weight: 300;
  font-size: 2rem;
  margin-right: 1rem;
`
const TurnName = styled.span`
  color: ${ props => props.theme.color.secondary};
  font-weight: bold;
`

const TokenSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  /* background-color: ${ props => props.theme.color.grey}; */
  /* padding: 0.5rem 0rem; */
`
const TokensTitle = styled.div`
  line-height: 1.25rem;
  font-size: 1.25rem;
  color: ${ props => props.theme.color.tertiary };
  text-decoration: underline;
  text-align: center;
`
const InvalidInput = styled.div`
  line-height: 1.5rem;
  font-size: 1rem;
  margin: 0.5rem;
`
const InvalidInputPlaceHolder = styled.div`
  height: ${`${1.5+0.5*2}rem`};
`
const GemstoneTokensPlaceholder = styled.div`
  height: ${ props => `${1.25+props.theme.token.modal.height+0.5*2+props.theme.button.height+0.5*2}rem`};
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
const FlashScreen = styled.div`
  font-family: ${ props => props.theme.fontFamily.tertiary};
  background: ${ props => props.theme.color.yourTurn };
  position: fixed;
  top: 0;
  left: 0;
  color: white;
  width: 100%;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
`

const BoardPlayerContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background: ${ props => props.theme.color.white};
  margin-bottom: 0.5rem;
  width: 100%;
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
const ActionLogContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0rem 1rem;
`

const ButtonPlaceHolder = styled.div`
  height: ${ props => `${props.theme.button.height+1}rem`};
`

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      actionLog: [],
      board: null,
      isMyTurn: false,
      curTurnIndex: 0,
      invalidInputError: null,
      serverError: null,
      gameID: this.props.gameID,
      curPlayer: null,
      playerID: this.props.playerID,
      players: [],
      roomCode: null,
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
      selectedGemStones: {},
      returningTokensPhase: false,
      flashingTurn: false,
    }
    this.socket = socket;
    this.onClientRequestError = this.onClientRequestError.bind(this)
    this.onEndTurn = this.onEndTurn.bind(this)
    this.onGameUpdate = this.onGameUpdate.bind(this)
    this.onPlayerConnection = this.onPlayerConnection.bind(this)
    this.onPurchaseActiveCard = this.onPurchaseActiveCard.bind(this)
    this.onPurchaseReservedCard = this.onPurchaseReservedCard.bind(this)
    this.onReserveActiveCard = this.onReserveActiveCard.bind(this)
    this.onReserveTierCard = this.onReserveTierCard.bind(this)
    this.onSkipTurn = this.onSkipTurn.bind(this)
    this.renderHands = this.renderHands.bind(this)
    this.onHackNobles = this.onHackNobles.bind(this)
    this.onRulesClick = this.onRulesClick.bind(this)
    this.onRulesClosed = this.onRulesClosed.bind(this)
    this.onLeaveGame = this.onLeaveGame.bind(this);
    this.onBoardTokenClick = this.onBoardTokenClick.bind(this)
    this.onPlayerTokenClick = this.onPlayerTokenClick.bind(this)
    this.onSelectedTokenClick = this.onSelectedTokenClick.bind(this)
    this.onPurchaseTokens = this.onPurchaseTokens.bind(this)
    this.onCancelPurchaseTokens = this.onCancelPurchaseTokens.bind(this)
  }

  componentDidMount() {
    window.onpopstate = () => { } // TODO: This is a hack. Figure out a way to register back button properly in WaitingRoom.jsx
    this.socket.on('UpdateGame', this.onGameUpdate)
    this.socket.on('PlayerLeft', this.onPlayerConnection)
    this.socket.on('PlayerReconnected', this.onPlayerConnection)
    this.socket.on('ClientRequestError', this.onClientRequestError)
    this.socket.emit('RequestGameUpdate', { gameID: this.state.gameID, playerID: this.state.playerID })
  }

  componentWillUnmount() {
    this.onLeaveGame();
    this.socket.off('UpdateGame', this.onGameUpdate)
    this.socket.off('PlayerLeft', this.onPlayerConnection)
    this.socket.off('PlayerReconnected', this.onPlayerConnection)
    this.socket.off('ClientRequestError', this.onClientRequestError)
  }

  onGameUpdate(data) {
    const game = deserialize(Buffer.from(data));
    const players = game.room.players;
    const board = game.board;
    const curPlayer = players[game.turnOrder[game.curTurnIndex]];
    const isMyTurn = curPlayer.id === this.state.playerID;

    this.setState({
      actionLog: game.actionLog,
      actionData: null,
      actionType: null,
      curTurnIndex: game.curTurnIndex,
      turnOrder: game.turnOrder,
      winner: game.winner,
      tieBreakerMoreRounds: game.tieBreakerMoreRounds,
      board: board,
      isMyTurn: isMyTurn,
      curPlayer: curPlayer,
      players: players,
      serverError: null,
      selectedGemStones: {},
      returningTokensPhase: false,
      roomCode: game.room.code,
    });

    if(isMyTurn) {
      this.setState({
        flashingTurn:true,
      })
      const timer = setTimeout(() =>{
        this.setState({
          flashingTurn: false,
        })
      }, 2000)
      return () => clearTimeout(timer);
    }
  }

  onPlayerConnection(data) {
    const game = deserialize(Buffer.from(data))
    const board = game.board;
    const players = game.room.players;
    const curPlayer = players[game.turnOrder[game.curTurnIndex]];
    const isMyTurn = curPlayer.id === this.state.playerID;

    // TODO: Bug when someone disconnects or reconnects, the curPlayer's hand and board resets if they're purchasing tokens. (Will need to redo their actions)
    this.setState({
      actionLog: game.actionLog,
      board: board,
      curTurnIndex: game.curTurnIndex,
      turnOrder: game.turnOrder,
      winner: game.winner,
      tieBreakerMoreRounds: game.tieBreakerMoreRounds,
      isMyTurn: isMyTurn,
      curPlayer: curPlayer,
      players: players,
      selectedGemStones: {},
      returningTokensPhase: false,
    })
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

  onBoardTokenClick(gemStone) {
    const boardSelectedGemStones = this.state.selectedGemStones;
    const availableGemStones = this.state.board.availableGemStones;
    const playerGemStones = this.state.players[this.state.curPlayer.id].hand.gemStones;

    // If you have placed a gemstone onto the board, you can always take it back into your hand.
    if(boardSelectedGemStones.hasOwnProperty(gemStone) && boardSelectedGemStones[gemStone] < 0 ){
      boardSelectedGemStones[gemStone] += 1;
      playerGemStones[gemStone] += 1
      availableGemStones[gemStone] -= 1

      if(boardSelectedGemStones[gemStone] === 0) {
        delete boardSelectedGemStones[gemStone]
      }

      const totalOwned = Object.values(playerGemStones)
        .reduce((acc, amount) => acc += amount, 0)
      this.setState({
        selectedGemStones: boardSelectedGemStones,
        returningTokensPhase: totalOwned > 10 ? true : false,
        invalidInputError: totalOwned > 10
          ? `Cannot have more than 10 tokens. Return ${totalOwned - 10} token(s) from selected or your hand.`
          : null
      })
      return;
    }

    // Only if that specific token isn't negative.
    const totalSelected = Object.values(boardSelectedGemStones)
      .reduce((acc, amount) => acc += amount, 0)
    const takenTwoOfSame = Object.values(boardSelectedGemStones)
      .reduce((acc, amount) => acc = acc || amount >= 2, false)
    const takenDiffType = Object.keys(boardSelectedGemStones)
      .reduce((acc, key) => acc = acc || (boardSelectedGemStones[key] >= 1 && key !== gemStone), false)

    if (totalSelected >= 3) {
      return;
    }
    if (availableGemStones[gemStone] < 1) {
      return;
    }
    if (takenTwoOfSame) {
      return;
    }
    if (boardSelectedGemStones.hasOwnProperty(gemStone)
      && boardSelectedGemStones[gemStone] >= 1
      && availableGemStones[gemStone] < 3
    ) {
      return;
    }
    if (boardSelectedGemStones.hasOwnProperty(gemStone)
      && boardSelectedGemStones[gemStone] >= 1
      && takenDiffType) {
      return;
    }

    if(!boardSelectedGemStones.hasOwnProperty(gemStone)) {
      boardSelectedGemStones[gemStone] = 0;
    }
    boardSelectedGemStones[gemStone] += 1;
    playerGemStones[gemStone] += 1
    availableGemStones[gemStone] -= 1

    const totalOwned = Object.values(playerGemStones)
      .reduce((acc, amount) => acc += amount, 0)
    this.setState({
      selectedGemStones: boardSelectedGemStones,
      returningTokensPhase: totalOwned > 10 ? true : false,
      invalidInputError: totalOwned > 10
        ? `Cannot have more than 10 tokens. Return ${totalOwned - 10} token(s) from selected or your hand.`
        : null
    })
  }

  onPlayerTokenClick(gemStone) {
    const availableGemStones = this.state.board.availableGemStones;
    const playerGemStones = this.state.players[this.state.curPlayer.id].hand.gemStones;
    const playerSelectedGemStones = this.state.selectedGemStones;

    // If you have taken the gem from the board, you can always put it back.
    if(playerSelectedGemStones.hasOwnProperty(gemStone) && playerSelectedGemStones[gemStone] > 0) {
      playerSelectedGemStones[gemStone] -= 1
      playerGemStones[gemStone] -= 1
      availableGemStones[gemStone] += 1

      if(playerSelectedGemStones[gemStone] === 0) {
        delete playerSelectedGemStones[gemStone]
      }

      const newTotalOwned = Object.values(playerGemStones)
        .reduce((acc, amount) => acc += amount, 0)
      this.setState({
        selectedGemStones: playerSelectedGemStones,
        returningTokensPhase: newTotalOwned > 10 ? true : false,
        invalidInputError: newTotalOwned > 10
          ? `Cannot have more than 10 tokens. Return ${newTotalOwned - 10} token(s).`
          : null
      })
      return;
    }

    const totalSelected = Object.values(playerSelectedGemStones)
      .reduce((acc, amount) => acc += amount, 0)
    const totalOwned = Object.values(playerGemStones)
      .reduce((acc, amount) => acc += amount, 0)

    if (totalSelected <= -3) {
      return;
    }
    if (playerGemStones[gemStone] < 1) {
      return;
    }

    // Can only return non-selected tokens if >10 had.
    if(totalOwned > 10) {
      if(!playerSelectedGemStones.hasOwnProperty(gemStone)) {
        playerSelectedGemStones[gemStone] = 0
      }
      playerSelectedGemStones[gemStone] -= 1
      playerGemStones[gemStone] -= 1
      availableGemStones[gemStone] += 1

      const newTotalOwned = Object.values(playerGemStones)
        .reduce((acc, amount) => acc += amount, 0)
      this.setState({
        selectedGemStones: playerSelectedGemStones,
        returningTokensPhase: newTotalOwned > 10 ? true : false,
        invalidInputError: newTotalOwned > 10
          ? `Cannot have more than 10 tokens. Return ${newTotalOwned - 10} token(s).`
          : null
      })
    }
    return;
  }

  onSelectedTokenClick(gemStone) {
    const availableGemStones = this.state.board.availableGemStones;
    const playerGemStones = this.state.players[this.state.curPlayer.id].hand.gemStones;
    const selectedSelectedGemStones = this.state.selectedGemStones;

    if (selectedSelectedGemStones.hasOwnProperty(gemStone) && selectedSelectedGemStones[gemStone] > 0) {
      selectedSelectedGemStones[gemStone] -= 1
      playerGemStones[gemStone] -= 1
      availableGemStones[gemStone] += 1

      if (selectedSelectedGemStones[gemStone] === 0) {
        delete selectedSelectedGemStones[gemStone]
      }
    }
    if (selectedSelectedGemStones.hasOwnProperty(gemStone) && selectedSelectedGemStones[gemStone] < 0) {
      selectedSelectedGemStones[gemStone] += 1;
      playerGemStones[gemStone] += 1
      availableGemStones[gemStone] -= 1

      if (selectedSelectedGemStones[gemStone] === 0) {
        delete selectedSelectedGemStones[gemStone]
      }
    }
    const totalOwned = Object.values(playerGemStones)
      .reduce((acc, amount) => acc += amount, 0)
    this.setState({
      selectedGemStones: selectedSelectedGemStones,
      returningTokensPhase: totalOwned > 10 ? true : false,
      invalidInputError: totalOwned > 10
        ? `Cannot have more than 10 tokens. Return ${totalOwned - 10} token(s) from selected or your hand.`
        : null
    })
    return;
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
            isMyTurn={this.state.isMyTurn}
            isThisPlayerTurn={player.id === this.state.turnOrder[this.state.curTurnIndex]}
            player={player}
            selectedGemStones={this.state.selectedGemStones}
            width={theme.card.icon.width * 6 + theme.card.spaceBetween * 12}
            handlePurchaseCard={this.onPurchaseReservedCard}
            handleTokenClick={this.onPlayerTokenClick}
          />
        </PlayerContainer>
      ))
    return (hands)
  }

  onPurchaseTokens() {
    const playerGemStones = this.state.players[this.state.curPlayer.id].hand.gemStones;
    const purchaseSelectedGemStones = this.state.selectedGemStones;
    const totalOwned = Object.values(playerGemStones)
      .reduce((acc, amount) => acc += amount, 0)
    const totalReturned = (Object.values(purchaseSelectedGemStones)
      .filter((amount) => amount < 0)
      .reduce((acc, amount) => acc += amount, 0))*-1
    const totalTaken = Object.values(purchaseSelectedGemStones)
      .filter((amount) => amount > 0)
      .reduce((acc, amount) => acc += amount, 0)
    if (totalOwned > 10) {
      this.setState({
        invalidInputError: `Cannot have more than 10 tokens. Return ${totalOwned - 10} token(s) from selected or your hand.`,
        returningTokensPhase: true,
      })
      return;
    }
    if (totalTaken > 3) {
      this.setState({
        invalidInputError: `Cannot take more than 3 tokens on a turn. Return ${totalTaken - 3} token(s).`,
        returningTokensPhase: true,
      })
      return;
    }
    if (totalReturned > 3) {
      this.setState({
        invalidInputError: `Cannot return more than 3 tokens on a turn. Take back ${totalReturned - 3} token(s).`,
        returningTokensPhase: true,
      })
      return;
    }
    if (totalReturned > totalTaken) {
      this.setState({
        invalidInputError: `Cannot return more tokens than taken. Take back ${10 - totalOwned} token(s).`,
      })
      return;
    }
    if (totalReturned > 0 && totalOwned < 10) {
      this.setState({
        invalidInputError: `Cannot return tokens so that you would have less than 10. Take or return ${10 - totalOwned} token(s).`,
      })
      return;
    }
    this.setState({
      actionData: this.state.selectedGemStones,
      actionType: ActionType.TAKE_GEMS,
      invalidInputError: null,
    }, this.onEndTurn)
  }

  onCancelPurchaseTokens() {
    const availableGemStones = this.state.board.availableGemStones;
    const playerGemStones = this.state.players[this.state.curPlayer.id].hand.gemStones;
    const cancelSelectedGemStones = this.state.selectedGemStones;

    Object.keys(cancelSelectedGemStones).forEach((gemStone) => {
      availableGemStones[gemStone] += cancelSelectedGemStones[gemStone]
      playerGemStones[gemStone] -= cancelSelectedGemStones[gemStone]
      delete cancelSelectedGemStones[gemStone]
    })

    this.setState({
      selectedGemStones: cancelSelectedGemStones,
      invalidInputError: null,
      returningTokensPhase: false,
    })
  }

  onPurchaseActiveCard(card) {
    this.setState({
      actionData: card.id,
      actionType: ActionType.PURCHASE_ACTIVE_CARD,
    }, this.onEndTurn)
  }

  onPurchaseReservedCard(card) {
    this.setState({
      actionData: card.id,
      actionType: ActionType.PURCHASE_RESERVED_CARD,
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
    this.setState({
      invalidInputError: null,
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
        ? <InvalidInput>{this.state.invalidInputError}</InvalidInput>
        : null
    );
    const ServerError = () => (
      (this.state.serverError && !this.state.invalidInputError)
        ? <p>Server Error: {this.state.serverError.message}</p>
        : null
    );
    const Turn = () => (this.state.isMyTurn
      ? <TurnDiv>It is <TurnName>your</TurnName> turn!</TurnDiv>
      : <TurnDiv>It is <TurnName>{this.state.curPlayer?.user?.name}'s</TurnName> turn</TurnDiv>
    );
    const Winner = () => (this.state.winner.id === this.state.playerID
      ? <WinnerScreen><h1>Congratulations <TurnName>you</TurnName> win!</h1></WinnerScreen>
      : <WinnerScreen><h1><TurnName>{this.state.winner.user.name}</TurnName> has won with {this.state.winner.hand.score} points</h1></WinnerScreen>
    );
    const FlashTurn = () => (<FlashScreen><h1>It is your turn!</h1></FlashScreen>);

    return (
      <GameContainer>
        {this.state.rulesClicked
          ? <Overlay></Overlay>
          : null
        }
        <CopyCodeContainer>
          <CopyToClipboard text={this.state.roomCode}>
            <div>
              {this.state.roomCode}
              <ClipBoard><i className="fa fa-clipboard"></i></ClipBoard>
            </div>
          </CopyToClipboard>
        </CopyCodeContainer>
        <Rules onClick={this.onRulesClick}>Rules <span><i className="fa fa-info-circle"></i></span></Rules>
        <PlayerTurnContainer>
          <Turn />
          <Timer isMyTurn={this.state.isMyTurn} />
        </PlayerTurnContainer>
        {this.state.isMyTurn && this.state.flashingTurn
          ? <FlashTurn />
          : null
        }
        {this.state.winner && !this.state.tieBreakerMoreRounds
          ? <Winner />
          : null
        }
        {this.state.isMyTurn && Object.keys(this.state.selectedGemStones).length > 0 ?
          <TokenSelectionContainer>
            <TokensTitle>Selected Tokens</TokensTitle>
            <GemStoneTokens
              gemStones={new Map(Object.entries(this.state.selectedGemStones))}
              handleTokenClick={this.onSelectedTokenClick}
              filterOutPurchasedCardTokens={true}
              filterOutReservedCardToken={true}
              isGemStoneTokenClickable={this.state.isMyTurn}
            />
            {/* {this.state.returningTokensPhase ? <TokensTitle>Your Tokens</TokensTitle>: null}
            {this.state.returningTokensPhase ?
              <GemStoneTokens
                gemStones={new Map(Object.entries(this.state.players[this.state.curPlayer.id].hand.gemStones))}
                handleTokenClick={this.onPlayerTokenClick}
                filterOutPurchasedCardTokens={true}
                filterOutReservedCardToken={true}
                isGemStoneTokenClickable={this.state.isMyTurn}
              />
              : null
            } */}
            {this.state.returningTokensPhase ?
              <div>
                <Button
                  color={theme.color.tertiary}
                  onClick={this.onCancelPurchaseTokens}>
                  Cancel
                </Button>
              </div>
              : <div>
                <Button
                  color={theme.color.primary}
                  onClick={this.onPurchaseTokens}>
                  Confirm
                </Button>
              </div>
            }
          </TokenSelectionContainer>
          : <GemstoneTokensPlaceholder/>
        }
        <InvalidInputError />
        <BoardPlayerContainer>
          <BoardContainer>
            <Title>Board</Title>
            {this.state.board ?
              <Board
                board={this.state.board}
                hand={this.state.players[this.state.playerID].hand}
                selectedGemStones={this.state.selectedGemStones}
                isMyTurn={this.state.isMyTurn}
                handlePurchaseCard={this.onPurchaseActiveCard}
                handleReserveCard={this.onReserveActiveCard}
                handleReserveTierCard={this.onReserveTierCard}
                handleTokenClick={this.onBoardTokenClick}
              />
              : <div></div>
            }
          </BoardContainer>
          <PlayersContainer>
            <Title order={-2}>Players</Title>
            {this.renderHands()}
          </PlayersContainer>
          <ActionLogContainer>
          <Title>Action Log</Title>
            <Actionlog
              actionLog={this.state.actionLog}
              width={theme.actionLog.width}
            />
          </ActionLogContainer>
        </BoardPlayerContainer>
        {this.state.isMyTurn ? <Button onClick={this.onSkipTurn} color={theme.color.tertiary}>Skip Turn</Button> : <ButtonPlaceHolder/>}
        {this.state.winner && !this.state.tieBreakerMoreRounds ?
          <Button
            color={theme.color.tertiary}
            onClick={this.onLeaveGame}>
            Leave Game
          </Button>
          : null
        }
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
