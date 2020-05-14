import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import Card from '../Card.jsx'
import theme from '../../styledcomponents/theme.jsx'
import { GemStone } from '../../enums/gemstones.js'
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import GemStoneTokens from './../GemStoneTokens.jsx'
import { canPurchaseCard } from '../../utils';
import ReturnTokens from './ReturnTokens.jsx'

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

class CardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      returningTokens: false,
      invalidInputError: null,
      selectedGemStones: new Map(),
    }
    this.onInvalidInput = this.onInvalidInput.bind(this)
    this.onPurchaseCard = this.onPurchaseCard.bind(this)
    this.onReserveCardPhase1 = this.onReserveCardPhase1.bind(this)
    this.onReserveCardPhase2 = this.onReserveCardPhase2.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.card !== prevProps.card ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn
    ) {
      this.setState({
        returningTokens: false,
        invalidInputError: null,
        selectedGemStones: new Map(),
      })
    }
  }

  onPurchaseCard(card) {
    const canPurchase = canPurchaseCard(this.props.card, this.props.playerPurchasedCards, this.props.playerGemStones)
    if (!canPurchase) {
      this.setState({
        invalidInputError: InsufficientGemsError
      })
      return;
    }
    this.props.handlePurchaseCard(card)
  }

  // TODO: Refactor this, TierCardModal, GemStoneTokens. Possibly seperate out Phase2 in all components to its own modal.
  onReserveCardPhase1() {
    if(Object.keys(this.props.playerReservedCards).length >= 3) {
      this.setState({
        invalidInputError: MaxThreeReservedCardsError
      })
      return;
    }
    const totalOwned = Object.values(this.props.playerGemStones)
      .reduce((acc, amount) => acc += amount, 0)
    const availableGoldTokens = this.props.availableGemStones[GemStone.GOLD];
    if(totalOwned >= 10 && availableGoldTokens > 0) {
      const selectedGemStones = new Map([[GemStone.GOLD, 1]]);
      this.setState({
        invalidInputError: `You will have more than 10 tokens after reserving. Please return 1 token.`,
        returningTokens: true,
        selectedGemStones: selectedGemStones,
      })
      return;
    }
    this.props.handleReserveCard()
  }

  onReserveCardPhase2(tokensReturned) {
    const returnedGemStones = Array.from(tokensReturned.keys())
    if(returnedGemStones.length !== 1) {
      this.setState({
        invalidInputError: `You will have more than 10 tokens after reserving. Please return 1 token.`,
      })
    }
    this.props.handleReserveCard(returnedGemStones.pop())
  }

  onInvalidInput(errorMessage) {
    this.setState({
      invalidInputError: errorMessage,
    })
  }

  render() {
    if (!this.props.card) {
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
          <Card card={this.props.card} width={theme.card.modal.width} height={theme.card.modal.height} />
        </CardContainer>
        {!this.state.returningTokens ?
          <div>
            <TokensOwned>
              <TokensOwnedTitle>Your Tokens</TokensOwnedTitle>
              <GemStoneTokens
                gemStones={new Map(Object.entries(this.props.playerGemStones))}
                purchasedCards={this.props.playerPurchasedCards}
                reservedCards={this.props.playerReservedCards}
                handleClick={() => { }}
                handleReservedClick={() => { }}
                handleTokenClick={() => { }}
                filterOutReservedCardToken={true}
              />
            </TokensOwned>
            {this.props.isPlayerTurn ?
              <div>
                <Button
                  color={theme.color.primary}
                  onClick={this.onPurchaseCard}>
                  Purchase Card
              </Button>
              </div>
              : null
            }
            {this.props.isPlayerTurn ?
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
        {this.props.isPlayerTurn && this.state.returningTokens ?
          <ReturnTokens
            playerGemStones={Object.entries(this.props.playerGemStones)}
            selectedGemStones={this.state.selectedGemStones}
            isPlayerTurn={this.props.isPlayerTurn}
            playerPurchasedCards={this.props.playerPurchasedCards}
            handleConfirm={this.onReserveCardPhase2}
            handleInvalidInput={this.onInvalidInput}
          />
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
