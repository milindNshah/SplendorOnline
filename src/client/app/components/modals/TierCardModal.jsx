import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import TierCard from "../TierCard.jsx"
import theme from '../../styledcomponents/theme.jsx'
import ModalContainer from "../../styledcomponents/modal-container.jsx"
import GemStoneTokens from './../GemStoneTokens.jsx'
import GemStoneToken from './../GemStoneToken.jsx'
import { GemStone } from '../../enums/gemstones.js'

const MaxThreeReservedCardsError = `Unable to reserve. You may only have 3 reserved cards.`

const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`
const TierCardContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`
const Phase2Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const TokensOwned = styled.div`
  margin-bottom: 1rem;
`
const TokensOwnedTitle = styled.p`
  color: ${ props => props.theme.color.black };
  text-decoration: underline;
`
const ReturnedTokenContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

class TierCardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: this.props.playerGemStones,
      playerPurchasedCards: this.props.playerPurchasedCards,
      playerReservedCards: this.props.playerReservedCards,
      invalidInputError: null,
      phase1: true,
      phase2: false,
      returnedToken: null,
    }
    this.onReserveCardPhase1 = this.onReserveCardPhase1.bind(this)
    this.onReserveCardPhase2 = this.onReserveCardPhase2.bind(this)
    this.onGiveToken = this.onGiveToken.bind(this)
    this.onTakeBackToken = this.onTakeBackToken.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.playerReservedCards !== prevProps.playerReservedCards ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn) {
      this.setState({
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: this.props.playerGemStones,
        playerPurchasedCards: this.props.playerPurchasedCards,
        playerReservedCards: this.props.playerReservedCards,
        phase1: true,
        phase2: false,
      })
    }
  }

  onReserveCardPhase1() {
    if (Object.keys(this.state.playerReservedCards).length >= 3) {
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
        {this.state.isPlayerTurn && this.state.phase1 ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.onReserveCardPhase1}>
              Reserve Card
            </Button>
          </div>
          : null
        }
        {this.state.isPlayerTurn && this.state.phase2 ?
          <Phase2Container>
            <TokensOwned>
              <TokensOwnedTitle>Your Tokens</TokensOwnedTitle>
              <GemStoneTokens
                gemStones={this.state.playerGemStones}
                purchasedCards={this.state.playerPurchasedCards}
                handleClick={() => { }}
                handleTokenClick={this.onGiveToken}
                handleReservedClick={() => { }}
                filterOutGold={false}
                filterOutPurchasedCardTokens={false}
                filterOutReservedCardToken={true}
                isGemStoneTokenClickable={this.state.isPlayerTurn}
              />
            </TokensOwned>
            <TokensOwned>
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
            </TokensOwned>
            <Button
              color={theme.color.secondary}
              onClick={this.onReserveCardPhase2}>
              Reserve Card
            </Button>
          </Phase2Container>
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
