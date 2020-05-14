import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import TierCard from "../TierCard.jsx"
import theme from '../../styledcomponents/theme.jsx'
import ModalContainer from "../../styledcomponents/modal-container.jsx"
import { GemStone } from '../../enums/gemstones.js'
import ReturnTokens from './ReturnTokens.jsx'

const MaxThreeReservedCardsError = `Unable to reserve. You may only have 3 reserved cards.`

const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`
const TierCardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`

class TierCardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      returningTokens: false,
      invalidInputError: null,
      selectedGemStones: new Map(),
    }
    this.onInvalidInput = this.onInvalidInput.bind(this)
    this.onReserveCardPhase1 = this.onReserveCardPhase1.bind(this)
    this.onReserveCardPhase2 = this.onReserveCardPhase2.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.playerReservedCards !== prevProps.playerReservedCards ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn) {
      this.setState({
        returningTokens: false,
        invalidInputError: null,
        selectedGemStones: new Map(),
      })
    }
  }

  // TODO: Merge onReserveCardPhase1 and onReserveCardPhase2 along with almost everything else with CardModal.
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
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <ErrorMessage>{this.state.invalidInputError}</ErrorMessage>
        : null
    );

    return (
      <ModalContainer width={this.props.width}>
        <TierCardContainer>
          <TierCard
            tier={this.props.tier}
            remaining={this.props.remaining}
            width={theme.card.modal.width}
            height={theme.card.modal.height} />
        </TierCardContainer>
        {this.props.isPlayerTurn && !this.state.returningTokens ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.onReserveCardPhase1}>
              Reserve Card
            </Button>
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
      </ModalContainer>
    )
  }
}

export default TierCardModal
