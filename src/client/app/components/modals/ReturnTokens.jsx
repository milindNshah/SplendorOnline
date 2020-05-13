import React from 'react'
import styled from 'styled-components'
import theme from '../../styledcomponents/theme.jsx'
import Button from '../../styledcomponents/button.jsx'
import GemStoneTokens from './../GemStoneTokens.jsx'

const TokensTitle = styled.div`
  margin: 1rem 0rem;
  color: ${ props => props.theme.color.black };
  text-decoration: underline;
  text-align: center;
`
const GemstoneTokensPlaceholder = styled.div`
  height: ${ props => `${props.theme.token.modal.height + 0.5}rem`};
`

class ReturnToken extends React.Component {
  constructor(props) {
    super(props)

    const playerGemStones = new Map(this.props.playerGemStones)
    const selectedGemStones = new Map(this.props.selectedGemStones)
    selectedGemStones.forEach((amount, gemStone) => {
      playerGemStones.set(gemStone, playerGemStones.get(gemStone)+amount)
    })

    this.state = {
      playerGemStones: playerGemStones,
      returnedGemStones: new Map(),
    }
    this.onReturnToken = this.onReturnToken.bind(this)
    this.onTakeBackToken = this.onTakeBackToken.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  onReturnToken(gemStone) {
    if(!this.props.isPlayerTurn) {
      return;
    }
    const playerGemStones = this.state.playerGemStones;
    const returnedGemStones = this.state.returnedGemStones;

    const totalOwned = Array.from(playerGemStones.values())
    .reduce((acc, amount) => acc += amount, 0)
    const totalReturned = Array.from(returnedGemStones.values())
      .reduce((acc, amount) => acc += amount, 0)
    const amountCanReturn = totalOwned + totalReturned > 10
      ? totalOwned + totalReturned - 10
      : 0;

    if(totalReturned >= 3  || totalReturned >= amountCanReturn) {
      return;
    }
    if(playerGemStones.get(gemStone) < 1) {
      return;
    }

    if (returnedGemStones.has(gemStone)) {
      returnedGemStones.set(gemStone, returnedGemStones.get(gemStone) + 1)
    } else {
      returnedGemStones.set(gemStone, 1)
    }
    playerGemStones.set(gemStone, playerGemStones.get(gemStone) - 1)

    this.setState({
      playerGemStones: playerGemStones,
      returnedGemStones: returnedGemStones,
    })
  }

  onTakeBackToken(gemStone) {
    if (!this.props.isPlayerTurn) {
      return;
    }
    const playerGemStones = this.state.playerGemStones;
    const returnedGemStones = this.state.returnedGemStones;
    if (returnedGemStones.get(gemStone) <= 1) {
      returnedGemStones.delete(gemStone)
    } else {
      returnedGemStones.set(gemStone, returnedGemStones.get(gemStone) - 1)
    }
    playerGemStones.set(gemStone, playerGemStones.get(gemStone) + 1)
    this.setState({
      playerGemStones: playerGemStones,
      returnedGemStones: returnedGemStones,
    })
  }

  onConfirm() {
    const totalOwned = Array.from(this.state.playerGemStones.values())
    .reduce((acc, amount) => acc += amount, 0)
    if(totalOwned > 10) {
      this.props.handleInvalidInput(`Cannot have more than 10 tokens. Please return ${totalOwned - 10} more token(s).`)
      return;
    }
    this.props.handleConfirm(this.state.returnedGemStones)
  }

  render() {
    return (
      <div>
        <TokensTitle>Your Tokens</TokensTitle>
        <GemStoneTokens
          gemStones={this.state.playerGemStones}
          purchasedCards={this.props.playerPurchasedCards}
          handleClick={() => { }}
          handleTokenClick={this.onReturnToken}
          handleReservedClick={() => { }}
          filterOutGold={false}
          filterOutPurchasedCardTokens={false}
          filterOutReservedCardToken={true}
          isGemStoneTokenClickable={this.props.isPlayerTurn}
        />
        {this.props.isPlayerTurn ?
          <>
            <TokensTitle>Returned Tokens</TokensTitle>
            {this.state.returnedGemStones.size > 0 ?
              <GemStoneTokens
                gemStones={this.state.returnedGemStones}
                purchasedCards={this.props.playerPurchasedCards}
                handleClick={() => { }}
                handleTokenClick={this.onTakeBackToken}
                handleReservedClick={() => { }}
                filterOutGold={false}
                filterOutPurchasedCardTokens={true}
                filterOutReservedCardToken={true}
                isGemStoneTokenClickable={this.props.isPlayerTurn}
              />
              : <GemstoneTokensPlaceholder />
            }
          </>
          : null
        }
        {this.props.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.onConfirm}>
              Confirm
            </Button>
          </div>
          : null
        }
      </div>
    )
  }
}

export default ReturnToken
