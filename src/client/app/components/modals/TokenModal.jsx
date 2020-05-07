import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import theme from '../../styledcomponents/theme.jsx'
import { GemStone } from '../../enums/gemstones'
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import GemStoneTokens from './../GemStoneTokens.jsx'

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

class TokenModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      availableGemStones: new Map(Object.entries(this.props.availableGemStones)),
      invalidInputError: null,
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: new Map(Object.entries(this.props.playerGemStones)),
      playerPurchasedCards: new Map(Object.entries(this.props.playerPurchasedCards)),
      taken: new Map(),
      returned: new Map(),
      phase1: true,
      phase2: false,
    }
    this.onGiveToken = this.onGiveToken.bind(this)
    this.onReturnToken = this.onReturnToken.bind(this)
    this.onTakeToken = this.onTakeToken.bind(this)
    this.onTakeBackToken = this.onTakeBackToken.bind(this)
    this.onPurchaseTokensPhase1 = this.onPurchaseTokensPhase1.bind(this)
    this.onPurchaseTokensPhase2 = this.onPurchaseTokensPhase2.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.availableGemStones !== prevProps.availableGemStones) {
      this.setState({
        availableGemStones: new Map(Object.entries(this.props.availableGemStones)),
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: new Map(Object.entries(this.props.playerGemStones)),
        playerPurchasedCards: new Map(Object.entries(this.props.playerPurchasedCards)),
      })
    }
  }

  onTakeToken(gemStone) {
    // TODO: Show disabled tokens somehow.
    if (!this.state.isPlayerTurn) {
      return;
    }
    if (gemStone === GemStone.GOLD) {
      return;
    }
    const taken = this.state.taken;
    const availableGemStones = this.state.availableGemStones;

    const totalTaken = Array.from(taken.values())
      .reduce((acc, amount) => acc += amount, 0)
    const takenTwoOfSame = Array.from(taken.values())
      .reduce((acc, amount) => acc = acc || amount >= 2, false)
    const takenDiffType = Array.from(taken.keys())
      .reduce((acc, key) => acc = acc || (taken.get(key) >= 1 && key !== gemStone), false)

    if (totalTaken >= 3) {
      return;
    }
    if (availableGemStones.get(gemStone) < 1) {
      return;
    }
    if (takenTwoOfSame) {
      return;
    }
    if (taken.has(gemStone)
      && taken.get(gemStone) >= 1
      && availableGemStones.get(gemStone) < 3
    ) {
      return;
    }
    if (taken.has(gemStone)
      && taken.get(gemStone) >= 1
      && takenDiffType) {
      return;
    }

    if (taken.has(gemStone)) {
      taken.set(gemStone, taken.get(gemStone) + 1)
    } else {
      taken.set(gemStone, 1)
    }
    availableGemStones.set(gemStone, availableGemStones.get(gemStone) - 1)
    this.setState({
      availableGemStones: availableGemStones,
      taken: taken,
      invalidInputError: null,
    })
  }

  onReturnToken(gemStone) {
    if (!this.state.isPlayerTurn) {
      return;
    }
    if (gemStone === GemStone.GOLD) {
      return;
    }

    const taken = new Map(this.state.taken);
    const availableGemStones = new Map(this.state.availableGemStones);

    if (taken.get(gemStone) <= 1) {
      taken.delete(gemStone)
    } else {
      taken.set(gemStone, taken.get(gemStone) - 1)
    }
    availableGemStones.set(gemStone, availableGemStones.get(gemStone) + 1)

    this.setState({
      availableGemStones: availableGemStones,
      taken: taken,
      invalidInputError: null,
    })
  }

  onGiveToken(gemStone) {
    if (!this.state.isPlayerTurn) {
      return;
    }
    const returned = this.state.returned;
    const playerGemStones = this.state.playerGemStones;

    const totalReturned = Array.from(returned.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalOwned = Array.from(playerGemStones.values())
      .reduce((acc, amount) => acc += amount, 0)
    const amountCanReturn = totalOwned + totalReturned >= 10
      ? totalOwned + totalReturned - 10
      : 0;

    if (totalReturned >= 3) {
      return;
    }
    if (totalReturned >= amountCanReturn) {
      return;
    }
    if (playerGemStones.get(gemStone) < 1) {
      return;
    }

    if (returned.has(gemStone)) {
      returned.set(gemStone, returned.get(gemStone) + 1)
    } else {
      returned.set(gemStone, 1)
    }
    playerGemStones.set(gemStone, playerGemStones.get(gemStone) - 1)
    this.setState({
      playerGemStones: playerGemStones,
      returned: returned,
      invalidInputError: null,
    })
  }

  onTakeBackToken(gemStone) {
    if (!this.state.isPlayerTurn) {
      return;
    }
    const returned = this.state.returned;
    const playerGemStones = this.state.playerGemStones;

    if (returned.get(gemStone) <= 1) {
      returned.delete(gemStone)
    } else {
      returned.set(gemStone, returned.get(gemStone) - 1)
    }
    playerGemStones.set(gemStone, playerGemStones.get(gemStone) + 1)
    this.setState({
      playerGemStones: playerGemStones,
      returned: returned,
    })
  }

  onPurchaseTokensPhase1() {
    const totalTaken = Array.from(this.state.taken.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalOwned = Array.from(this.state.playerGemStones.values())
      .reduce((acc, amount) => acc += amount, 0)
    if(totalTaken <= 0) {
      this.setState({
        invalidInputError: ZeroTokensError
      })
      return;
    }
    if(totalTaken + totalOwned > 10) {
      const newPlayerGemStones = Array.from(this.state.playerGemStones.keys())
        .reduce((map, key) => {
          let toAdd = this.state.playerGemStones.get(key);
          if(this.state.taken.has(key)) {
            toAdd += this.state.taken.get(key)
          }
          return map.set(key, toAdd);
        }, new Map())
      this.setState({
        invalidInputError: `Cannot have more than 10 tokens. Please return ${totalTaken + totalOwned - 10} token(s).`,
        playerGemStones: newPlayerGemStones,
        phase1: false,
        phase2: true,
      })
      return;
    }
    this.props.handlePurchaseTokens(this.state.taken, this.state.returned)
  }

  onPurchaseTokensPhase2() {
    const totalOwned = Array.from(this.state.playerGemStones.values())
      .reduce((acc, amount) => acc += amount, 0)
    if(totalOwned > 10) {
      this.setState({
        invalidInputError: `Cannot have more than 10 tokens. Please return ${totalOwned - 10} more token(s).`,
      })
      return;
    }
    this.props.handlePurchaseTokens(this.state.taken, this.state.returned)
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
              gemStones={Object.fromEntries(this.state.availableGemStones)}
              purchasedCards={this.props.playerPurchasedCards}
              handleClick={() => { }}
              handleReservedClick={() => { }}
              handleTokenClick={this.onTakeToken}
              filterOutGold={true}
              filterOutPurchasedCardTokens={true}
              isGemStoneTokenClickable={true}
            />
            {this.state.isPlayerTurn ? <TokensTitle>Selected Tokens</TokensTitle> : null}
            {this.state.taken.size > 0 && this.state.isPlayerTurn ?
              <GemStoneTokens
                gemStones={Object.fromEntries(this.state.taken)}
                purchasedCards={this.props.playerPurchasedCards}
                handleClick={() => { }}
                handleReservedClick={() => { }}
                handleTokenClick={this.onReturnToken}
                filterOutGold={true}
                filterOutPurchasedCardTokens={true}
                isGemStoneTokenClickable={true}
              />
              : null
            }
            <TokensTitle>Your Tokens</TokensTitle>
            <GemStoneTokens
              gemStones={Object.fromEntries(this.state.playerGemStones)}
              purchasedCards={this.props.playerPurchasedCards}
              handleClick={() => { }}
              handleTokenClick={() => { }}
              handleReservedClick={() => { }}
              filterOutGold={false}
              filterOutPurchasedCardTokens={false}
              isGemStoneTokenClickable={false}
            />
            {this.state.isPlayerTurn ?
              <div>
                <Button
                  color={theme.color.secondary}
                  onClick={this.onPurchaseTokensPhase1}>
                  Confirm
                </Button>
              </div>
              : null
            }
          </div>
          : null
        }
        {this.state.phase2 ?
          <div>
            <TokensTitle>Your Tokens</TokensTitle>
            <GemStoneTokens
              gemStones={Object.fromEntries(this.state.playerGemStones)}
              purchasedCards={this.props.playerPurchasedCards}
              handleClick={() => { }}
              handleTokenClick={this.onGiveToken}
              handleReservedClick={() => { }}
              filterOutGold={false}
              filterOutPurchasedCardTokens={false}
              isGemStoneTokenClickable={true}
            />
            {this.state.isPlayerTurn ? <TokensTitle>Returned Tokens</TokensTitle> : null}
            {this.state.returned.size > 0 && this.state.isPlayerTurn ?
              <GemStoneTokens
                gemStones={Object.fromEntries(this.state.returned)}
                purchasedCards={this.props.playerPurchasedCards}
                handleClick={() => { }}
                handleTokenClick={this.onTakeBackToken}
                handleReservedClick={() => { }}
                filterOutGold={false}
                filterOutPurchasedCardTokens={true}
                isGemStoneTokenClickable={true}
              />
              : null
            }
            {this.state.isPlayerTurn ?
              <div>
                <Button
                  color={theme.color.secondary}
                  onClick={this.onPurchaseTokensPhase2}>
                  Confirm
                </Button>
              </div>
              : null
            }
          </div>
          : null
        }
        <div>
          <Button
            color={theme.color.error}
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
