import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import Card from '../Card.jsx'
import theme from '../../styledcomponents/theme.jsx'
import { GemStone } from '../../enums/gemstones.js'
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import GemStoneTokens from './../GemStoneTokens.jsx'
import GemStoneToken from './../GemStoneToken.jsx'
import { canPurchaseCard } from '../../utils';

const MaxThreeReservedCardsError = `Unable to reserve. You may only have 3 reserved cards.`
const InsufficientGemsError = `Not sufficient gems to purchase card.`

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`
const TokensOwned = styled.div`
  margin-bottom: 1rem;
`
const TokensOwnedTitle = styled.p`
  color: ${ props => props.theme.color.black };
  text-decoration: underline;
`
const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`
const ReturnedTokenContainer = styled.div`
  display: flex;
  flex-direction: row;
`

class CardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      card: this.props.card,
      invalidInputError: null,
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: this.props.playerGemStones,
      playerPurchasedCards: this.props.playerPurchasedCards,
      playerReservedCards: this.props.playerReservedCards,
      phase1: true,
      phase2: false,
      returnedToken: null,
    }
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReserveCardPhase1 = this.onReserveCardPhase1.bind(this)
    this.onReserveCardPhase2 = this.onReserveCardPhase2.bind(this)
    this.onGiveToken = this.onGiveToken.bind(this)
    this.onTakeBackToken = this.onTakeBackToken.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.card !== prevProps.card ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn) {
      this.setState({
        card: this.props.card,
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: this.props.playerGemStones,
        playerPurchasedCards: this.props.playerPurchasedCards,
        playerReservedCards: this.props.playerReservedCards,
        phase1: true,
        phaes2: false,
      })
    }
  }

  onPurchaseCard(card) {
    const canPurchase = canPurchaseCard(card, this.props.purchasedCards, this.props.gemStones)
    if (!canPurchase) {
      this.setState({
        invalidInputError: InsufficientGemsError
      })
      return;
    }
    this.props.handlePurchaseCard(card)
  }

  // TODO: Refactor this, TokenModal, TierCardModal, GemStoneTokens. Possibly seperate out Phase2 in all components to its own modal.
  onReserveCardPhase1() {
    if(Object.keys(this.state.playerReservedCards).length >= 3) {
      this.setState({
        invalidInputError: MaxThreeReservedCardsError
      })
      return;
    }
    const totalOwned = Object.values(this.state.playerGemStones)
      .reduce((acc, amount) => acc += amount, 0)
    const availableGoldTokens = this.props.availableGemStones[GemStone.GOLD];
    if(totalOwned >= 10 && availableGoldTokens > 0) {
      this.setState({
        invalidInputError: `You will have more than 10 tokens after reserving. Please return 1 token.`,
        phase1: false,
        phase2: true,
      })
      return;
    }
    this.props.handleReserveCard()
  }

  onReserveCardPhase2() {
    const totalOwned = Object.values(this.state.playerGemStones)
    .reduce((acc, amount) => acc += amount, 0)
    if(this.state.returnedToken === null || totalOwned >= 10) {
      this.setState({
        invalidInputError: `You will have more than 10 tokens after reserving. Please return 1 token.`,
      })
      return;
    }
    this.props.handleReserveCard(this.state.returnedToken)
  }

  onGiveToken(gemStone) {
    if(!this.state.isPlayerTurn) {
      return;
    }
    if(this.state.returnedToken !== null){
      return;
    }

    const playerGemStones = this.state.playerGemStones;
    if (playerGemStones[gemStone] < 1) {
      return;
    }

    playerGemStones[gemStone] = playerGemStones[gemStone]-1
    this.setState({
      playerGemStones: playerGemStones,
      returnedToken: gemStone,
      invalidInputError: null,
    })
  }

  onTakeBackToken() {
    if(!this.state.isPlayerTurn) {
      return;
    }
    if(this.state.returnedToken === null) {
      return;
    }
    const playerGemStones = this.state.playerGemStones;
    playerGemStones[this.state.returnedToken] = playerGemStones[this.state.returnedToken]+1

    this.setState({
      playerGemStones: playerGemStones,
      returnedToken: null,
    })
  }

  render() {
    if (!this.state.card) {
      return <div></div>;
    }
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <ErrorMessage>{this.state.invalidInputError}</ErrorMessage>
        : null
    );

    return (
      <ModalContainer width={this.props.width}>
        <CardContainer>
          <Card card={this.state.card} width={theme.card.modal.width} height={theme.card.modal.height} />
        </CardContainer>
        {this.state.phase1 ?
          <div>
            {this.props.playerGemStones && this.props.playerPurchasedCards ?
              <TokensOwned>
                <TokensOwnedTitle>Your Tokens</TokensOwnedTitle>
                <GemStoneTokens
                  gemStones={this.state.playerGemStones}
                  purchasedCards={this.state.playerPurchasedCards}
                  reservedCards={this.state.playerReservedCards}
                  handleClick={() => { }}
                  handleReservedClick={() => { }}
                  handleTokenClick={() => { }}
                  filterOutReservedCardToken={true}
                />
              </TokensOwned>
              : null
            }
            {this.state.isPlayerTurn && this.props.handlePurchaseCard ?
              <div>
                <Button
                  color={theme.color.primary}
                  onClick={this.onPurchaseCard}>
                  Purchase Card
              </Button>
              </div>
              : null
            }
            {this.state.isPlayerTurn && this.props.handleReserveCard ?
              <div>
                <Button
                  color={theme.color.secondary}
                  onClick={this.onReserveCardPhase1}>
                  Reserve Card
            </Button>
              </div>
              : null
            }
          </div>
          : null
        }
        {this.state.phase2 ?
          <div>
            <TokensOwned>
              <TokensOwnedTitle>Your Tokens</TokensOwnedTitle>
              <GemStoneTokens
                gemStones={this.state.playerGemStones}
                purchasedCards={this.state.playerPurchasedCards}
                reservedCards={this.state.playerReservedCards}
                handleClick={() => { }}
                handleTokenClick={this.onGiveToken}
                handleReservedClick={() => { }}
                filterOutGold={false}
                filterOutPurchasedCardTokens={false}
                filterOutReservedCardToken={true}
                isGemStoneTokenClickable={this.state.isPlayerTurn}
              />
            </TokensOwned>
            <TokensOwnedTitle>Returned Token</TokensOwnedTitle>
            {this.state.returnedToken ?
              <ReturnedTokenContainer>
                <div onClick={this.onTakeBackToken}>
                  <GemStoneToken
                    type={this.state.returnedToken}
                    amount={1}
                    width={theme.token.modal.width}
                    height={theme.token.modal.height}
                    isClickable={this.state.isPlayerTurn}
                  />
                </div>
              </ReturnedTokenContainer>
              : null
            }
            {this.state.isPlayerTurn && this.props.handleReserveCard ?
              <div>
                <Button
                  color={theme.color.secondary}
                  onClick={this.onReserveCardPhase2}>
                  Reserve Card
                </Button>
              </div>
              : null
            }
          </div>
          : null
        }
        <div>
          <Button
            color={theme.color.tertiary}
            onClick={this.props.handleClose}>
            Close
          </Button>
        </div>
        <InvalidInputError />
      </ModalContainer>)
  }
}

export default CardModal;
