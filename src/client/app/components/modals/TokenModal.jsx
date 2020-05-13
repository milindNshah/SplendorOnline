import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import theme from '../../styledcomponents/theme.jsx'
import { GemStone } from '../../enums/gemstones'
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import GemStoneTokens from './../GemStoneTokens.jsx'
import ReturnTokens from './ReturnTokens.jsx'

const ZeroTokensError = `You must take atleast 1 token.`

const TokensTitle = styled.div`
  margin: 1rem 0rem;
  color: ${ props => props.theme.color.black };
  text-decoration: underline;
  text-align: center;
`
const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`
const GemstoneTokensPlaceholder = styled.div`
  height: ${ props => `${props.theme.token.modal.height}rem`};
`

class TokenModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      availableGemStones: new Map(Object.entries(this.props.availableGemStones)),
      playerGemStones: new Map(Object.entries(this.props.playerGemStones)),
      selectedGemStones: new Map(),
      phase1: true,
      phase2: false,
      invalidInputError: null,
    }
    this.onConfirmPhase1 = this.onConfirmPhase1.bind(this)
    this.onConfirmPhase2 = this.onConfirmPhase2.bind(this)
    this.onInvalidInput = this.onInvalidInput.bind(this)
    this.onReturnToken = this.onReturnToken.bind(this)
    this.onSelectToken = this.onSelectToken.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.availableGemStones !== prevProps.availableGemStones ||
      this.props.playerGemStones !== prevProps.playerGemStones ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn
    ) {
      this.setState({
        availableGemStones: new Map(Object.entries(this.props.availableGemStones)),
        playerGemStones: new Map(Object.entries(this.props.playerGemStones)),
        selectedGemStones: new Map(),
        phase1: true,
        phase2: false,
        invalidInputError: null,
      })
    }
  }

  onSelectToken(gemStone) {
    if (!this.props.isPlayerTurn) {
      return;
    }
    if (gemStone === GemStone.GOLD) {
      return;
    }
    const selectedGemstones = this.state.selectedGemStones;
    const availableGemStones = this.state.availableGemStones;

    const totalSelected = Array.from(selectedGemstones.values())
      .reduce((acc, amount) => acc += amount, 0)
    const takenTwoOfSame = Array.from(selectedGemstones.values())
      .reduce((acc, amount) => acc = acc || amount >= 2, false)
    const takenDiffType = Array.from(selectedGemstones.keys())
      .reduce((acc, key) => acc = acc || (selectedGemstones.get(key) >= 1 && key !== gemStone), false)

    if (totalSelected >= 3) {
      return;
    }
    if (availableGemStones.get(gemStone) < 1) {
      return;
    }
    if (takenTwoOfSame) {
      return;
    }
    if (selectedGemstones.has(gemStone)
      && selectedGemstones.get(gemStone) >= 1
      && availableGemStones.get(gemStone) < 3
    ) {
      return;
    }
    if (selectedGemstones.has(gemStone)
      && selectedGemstones.get(gemStone) >= 1
      && takenDiffType) {
      return;
    }

    if (selectedGemstones.has(gemStone)) {
      selectedGemstones.set(gemStone, selectedGemstones.get(gemStone) + 1)
    } else {
      selectedGemstones.set(gemStone, 1)
    }
    availableGemStones.set(gemStone, availableGemStones.get(gemStone) - 1)
    this.setState({
      availableGemStones: availableGemStones,
      selectedGemStones: selectedGemstones,
      invalidInputError: null,
    })
  }

  onReturnToken(gemStone) {
    if (!this.props.isPlayerTurn) {
      return;
    }
    if (gemStone === GemStone.GOLD) {
      return;
    }

    const selectedGemStones = new Map(this.state.selectedGemStones);
    const availableGemStones = new Map(this.state.availableGemStones);

    if (selectedGemStones.get(gemStone) <= 1) {
      selectedGemStones.delete(gemStone)
    } else {
      selectedGemStones.set(gemStone, selectedGemStones.get(gemStone) - 1)
    }
    availableGemStones.set(gemStone, availableGemStones.get(gemStone) + 1)

    this.setState({
      availableGemStones: availableGemStones,
      selectedGemStones: selectedGemStones,
      invalidInputError: null,
    })
  }

  onConfirmPhase1() {
    const totalSelected = Array.from(this.state.selectedGemStones.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalOwned = Array.from(this.state.playerGemStones.values())
      .reduce((acc, amount) => acc += amount, 0)
    if(totalSelected <= 0) {
      this.setState({
        invalidInputError: ZeroTokensError
      })
      return;
    }
    if(totalSelected + totalOwned > 10) {
      this.setState({
        invalidInputError: `Cannot have more than 10 tokens. Please return ${totalSelected + totalOwned - 10} token(s).`,
        phase1: false,
        phase2: true,
      })
      return;
    }
    this.props.handlePurchaseTokens(this.state.selectedGemStones, null)
  }

  onConfirmPhase2(returnedGemStones) {
    this.props.handlePurchaseTokens(this.state.selectedGemStones, returnedGemStones)
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
        {this.state.phase1 ?
          <div>
            <TokensTitle>Available Tokens</TokensTitle>
            <GemStoneTokens
              gemStones={this.state.availableGemStones}
              purchasedCards={this.props.playerPurchasedCards}
              handleClick={() => { }}
              handleReservedClick={() => { }}
              handleTokenClick={this.onSelectToken}
              filterOutGold={true}
              filterOutPurchasedCardTokens={true}
              filterOutReservedCardToken={true}
              isGemStoneTokenClickable={this.props.isPlayerTurn}
            />
            {this.props.isPlayerTurn ?
              <>
                <TokensTitle>Selected Tokens</TokensTitle>
                {this.state.selectedGemStones.size > 0 ?
                  <GemStoneTokens
                    gemStones={this.state.selectedGemStones}
                    purchasedCards={this.props.playerPurchasedCards}
                    handleClick={() => { }}
                    handleReservedClick={() => { }}
                    handleTokenClick={this.onReturnToken}
                    filterOutGold={true}
                    filterOutPurchasedCardTokens={true}
                    filterOutReservedCardToken={true}
                    isGemStoneTokenClickable={this.props.isPlayerTurn}
                  />
                  : <GemstoneTokensPlaceholder />
                }
              </>
              : null
            }
            <TokensTitle>Your Tokens</TokensTitle>
            <GemStoneTokens
              gemStones={this.state.playerGemStones}
              purchasedCards={this.props.playerPurchasedCards}
              handleClick={() => { }}
              handleTokenClick={() => { }}
              handleReservedClick={() => { }}
              filterOutGold={false}
              filterOutPurchasedCardTokens={false}
              filterOutReservedCardToken={true}
              isGemStoneTokenClickable={false}
            />
            {this.props.isPlayerTurn ?
              <div>
                <Button
                  color={theme.color.secondary}
                  onClick={this.onConfirmPhase1}>
                  Confirm
                </Button>
              </div>
              : null
            }
          </div>
          : null
        }
        {this.state.phase2 ?
          <ReturnTokens
            playerGemStones={this.state.playerGemStones}
            selectedGemStones={this.state.selectedGemStones}
            isPlayerTurn={this.props.isPlayerTurn}
            playerPurchasedCards={this.props.playerPurchasedCards}
            handleConfirm={this.onConfirmPhase2}
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

export default TokenModal;
