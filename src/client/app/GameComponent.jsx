import React from 'react';
import Button from 'react-bootstrap/Button';
import { deserialize } from 'bson';
import { socket } from './socket';
import { GemStone } from './enums/gemstones';
import { ActionType } from './enums/actiontype';
import { CardTier } from './enums/cardtier';

class GameComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gameID: this.props.gameID,
      playerID: this.props.playerID,
      errorMessage: null,
      players: [{}],
      player: {},
      board: {},
      targetScore: this.props.targetScore,
      turnOrder: [],
      curTurnIndex: 0,
      gameTurn: 0,
      winner: {},
      curPlayerTurn: {},
      gemsTaken: null,
      reservedActiveCard: null,
      reservedDeckCardTier: null,
      cardPurchased: null,
    }
    this.socket = socket;
    this.onGameUpdate = this.onGameUpdate.bind(this);
    this.onClientRequestError = this.onClientRequestError.bind(this);
    this.onTakeGems = this.onTakeGems.bind(this);
    this.onReserveActiveCard = this.onReserveActiveCard.bind(this);
    this.onReserveDeckCard = this.onReserveDeckCard.bind(this);
    this.onPurchaseCard = this.onPurchaseCard.bind(this);
    this.onEndTurn = this.onEndTurn.bind(this);
  }

  componentDidMount() {
    this.socket.on('updateGame', this.onGameUpdate);
    this.socket.on('ClientRequestError', this.onClientRequestError);
    this.socket.emit('requestGameUpdate', this.state.gameID);
  }

  componentWillUnmount() {
    this.socket.off('updateGame', this.onGameUpdate);
    this.socket.off('ClientRequestError', this.onClientRequestError);
  }

  onGameUpdate(data) {
    const game = deserialize(Buffer.from(data));
    const players = new Map(Object.entries(game.room.players));
    const player = players.get(this.state.playerID);
    const board = game.board;
    const curPlayerTurn = players.get(game.turnOrder[game.curTurnIndex]);

    this.setState({
      turnOrder: game.turnOrder,
      curTurnIndex: game.curTurnIndex,
      gameTurn: game.gameTurn,
      winner: game.winner,
      board: board,
      players: players,
      player: player,
      curPlayerTurn: curPlayerTurn,
    });
  }

  onClientRequestError(err) {
    this.setState({
      errorMessage: err,
    });
  }

  onTakeGems() {
    const gemsTaken = {
      [GemStone.DIAMOND]: 1,
      [GemStone.RUBY]: 1,
      [GemStone.EMERALD]: 1,
    };
    this.setState({
      gemsTaken: gemsTaken,
    });
  }

  onReserveActiveCard() {
    const activeTieredCards = new Map(Object.entries(this.state.board.activeTieredCards))
    const tier1cards = new Map(Object.entries(activeTieredCards.get(CardTier.TIER1)))
    const tier1Card = Array.from(tier1cards.values()).pop();
    this.setState({
      reservedActiveCard: tier1Card,
    })
  }

  onReserveDeckCard() {
    this.setState({
      reservedDeckCardTier: CardTier.TIER1
    })
  }

  onPurchaseCard() {
    const remainingTieredCards = new Map(Object.entries(this.state.board.remainingTieredCards))
    const tier1cards = new Map(Object.entries(remainingTieredCards.get(CardTier.TIER1)))
    const tier1Card = Array.from(tier1cards.values()).pop();
    this.setState({
      cardPurchased: tier1Card,
    })
  }

  onEndTurn() {
    const actions = {};
    if(this.state.gemsTaken) {
      actions[ActionType.TAKE_GEMS] = this.state.gemsTaken;
    }
    if(this.state.reservedActiveCard) {
      actions[ActionType.RESERVE_ACTIVE_CARD] = this.state.reservedActiveCard.id;
    }
    if(this.state.reservedDeckCardTier) {
      actions[ActionType.RESERVE_DECK_CARD] = this.state.reservedDeckCardTier;
    }
    if(this.state.cardPurchased) {
      actions[ActionType.PURCHASE_CARD] = this.state.cardPurchased.id;
    }

    this.socket.emit("endTurn", {
      actions: actions,
      gameID: this.state.gameID,
      playerID: this.state.playerID
    })

    this.setState({
      gemsTaken: null,
      reservedActiveCard: null,
      reservedDeckCardTier: null,
      cardPurchased: null,
    });
  }

  render() {
    const ErrorMessage = () => (this.state.errorMessage
      ? <div>{this.state.errorMessage.name}: {this.state.errorMessage.message}</div>
      : null
    );

    const TurnDiv = () => (this.state.curPlayerTurn.id === this.state.playerID
      ? <p>It is your turn!</p>
    : <p>It is Player {this.state.curPlayerTurn.user?.name}'s turn</p>
    );

    const EndTurnButton = () => (
      this.state.curPlayerTurn.id === this.state.playerID
    ? <Button variant="outline-primary" onClick={this.onEndTurn}>End Turn</Button>
    : <Button variant="outline-dark">Waiting for Other Players</Button>
    );

    const TakeGemsButton = () => (
      this.state.curPlayerTurn.id === this.state.playerID
      ? <Button variant="outline-primary" onClick={this.onTakeGems}>Take Gems</Button>
      : null
    );

    const ReserveActiveCardButton = () => (
      this.state.curPlayerTurn.id === this.state.playerID
      ? <Button variant="outline-primary" onClick={this.onReserveActiveCard}>ReserveActiveCard</Button>
      : null
    );

    const ReserveDeckCardButton = () => (
      this.state.curPlayerTurn.id === this.state.playerID
      ? <Button variant="outline-primary" onClick={this.onReserveDeckCard}>ReserveDeckCard</Button>
      : null
    );

    const PurchaseCardButton = () => (
      this.state.curPlayerTurn.id === this.state.playerID
      ? <Button variant="outline-primary" onClick={this.onPurchaseCard}>Purchase Card</Button>
      : null
    );

    return (
      <div>
        <h1>This is the Game Component</h1>
        <p>TargetScore: {this.state.targetScore}</p>
        <p>GameTurn: {this.state.gameTurn}</p>
        <p>Player: {this.state.player.user?.name}</p>
        <p>My Score: {this.state.player.hand?.score}</p>
        <TurnDiv/>
        <TakeGemsButton/>
        <ReserveActiveCardButton/>
        <ReserveDeckCardButton/>
        <PurchaseCardButton/>
        <EndTurnButton/>
        <p>Winner: {this.state.winner?.user?.name}</p>
        <ErrorMessage/>
      </div>
    )
  }
}

export default GameComponent;
