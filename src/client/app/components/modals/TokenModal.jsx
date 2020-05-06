import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import theme from '../../styledcomponents/theme.jsx'
import { GemStone } from '../../enums/gemstones'
import ModalContainer from '../../styledcomponents/modal-container.jsx'
import GemStoneTokens from './../GemStoneTokens.jsx'

const MoreThanTenError = `Cannot have more than 10 tokens.`
const ReturnMoreThanTakenError = `Cannot return more tokens than you have taken.`
const ReturnLessThanTenError = `Cannot return tokens such that you have less than 10 tokens.`

const TokensTitle = styled.div`
  margin: 0.5rem 0rem;
  color: ${ props => props.theme.color.black };
  text-decoration: underline;
  text-align: center;
`
const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`

// TODO: Make this a two step process for better UX: Take and if necessary Return.
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
    }
    this.onGiveToken = this.onGiveToken.bind(this)
    this.onPurchaseTokens = this.onPurchaseTokens.bind(this)
    this.onReturnToken = this.onReturnToken.bind(this)
    this.onTakeToken = this.onTakeToken.bind(this)
    this.onTakeBackToken = this.onTakeBackToken.bind(this)
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
    console.log("taking Token");
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
    })
  }

  onReturnToken(gemStone) {
    console.log("returning Token");
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
    console.log("giving token")
    if (!this.state.isPlayerTurn) {
      return;
    }
    if (gemStone === GemStone.GOLD) {
      return;
    }
    const returned = this.state.returned;
    const playerGemStones = this.state.playerGemStones;

    const totalReturned = Array.from(returned.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalTaken = Array.from(this.state.taken.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalOwned = Array.from(playerGemStones.values())
      .reduce((acc, amount) => acc += amount, 0)
    const amountCanReturn = totalOwned + totalReturned + totalTaken >= 10
      ? totalOwned + totalReturned + totalTaken - 10
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
    console.log("taking back token")
    if (!this.state.isPlayerTurn) {
      return;
    }
    if (gemStone === GemStone.GOLD) {
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

  onPurchaseTokens() {
    const totalTaken = Array.from(this.state.taken.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalOwned = Array.from(this.state.playerGemStones.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalReturned = Array.from(this.state.returned.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalHas = totalTaken + totalOwned;
    if (totalHas > 10) {
      this.setState({
        invalidInputError: MoreThanTenError
      })
      return;
    }
    if (totalReturned > totalTaken) {
      this.setState({
        invalidInputError: ReturnMoreThanTakenError
      })
      return;
    }
    if (totalOwned + totalTaken < 10 && totalReturned > 0) {
      this.setState({
        invalidInputError: ReturnLessThanTenError
      })
      return;
    }

    this.props.handlePurchaseTokens(this.state.taken, this.state.returned)
    this.setState({
      taken: new Map()
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
        </div>
        {this.state.taken.size > 0
          ? <div>
            <TokensTitle>Selected Tokens</TokensTitle>
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
          </div>
          : null
        }
        {this.state.returned.size > 0
          ? <div>
            <TokensTitle>Returned Tokens</TokensTitle>
            <GemStoneTokens
              gemStones={Object.fromEntries(this.state.returned)}
              purchasedCards={this.props.playerPurchasedCards}
              handleClick={() => { }}
              handleTokenClick={this.onReturnToken}
              handleReservedClick={() => { }}
              filterOutGold={false}
              filterOutPurchasedCardTokens={true}
              isGemStoneTokenClickable={true}
            />
          </div>
          : null
        }
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
        </div>
        {/*  TODO: When clicking exchange and no tokens taken: Display warning/confirmation. */}
        {this.state.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.onPurchaseTokens}>
              Confirm
          </Button>
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
