import React from 'react'
import styled from "styled-components"
import Button from '../styledcomponents/button.jsx'
import GemStoneToken from './GemStoneToken.jsx'
import theme from '../styledcomponents/theme.jsx'
import { GemStone } from '../enums/gemstones'

const TokenModalContainer = styled.div`
  width: ${ props => `${props.width}rem`};
  max-width: ${ props => `${props.width}rem`};
  padding: 2rem;
  background-color: ${ props => props.theme.color.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`
const TokensTitle = styled.div`
  color: ${ props => props.theme.color.secondary};
`
const Row = styled.div`
  margin: 0.5rem 0rem;
  display: flex;
  justify-content: flex-start;
`
const Col = styled.div`
  margin: 0rem 0.5rem;
`
const InvalidInput = styled.p`
  padding: 1rem;
  color: ${ props => props.theme.color.error};
  text-align: left;
`

class TokenModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      availableGemStones: new Map(Object.entries(this.props.availableGemStones)),
      invalidInputError: null,
      isPlayerTurn: this.props.isPlayerTurn,
      playerGemStones: new Map(Object.entries(this.props.playerGemStones)),
      taken: new Map(),
      returned: new Map(),
    }
    this.onGiveToken = this.onGiveToken.bind(this)
    this.onPurchaseTokens = this.onPurchaseTokens.bind(this)
    this.onReturnToken = this.onReturnToken.bind(this)
    this.onTakeToken = this.onTakeToken.bind(this)
    this.onTakeBackToken = this.onTakeBackToken.bind(this)
    this.renderGemStoneTokens = this.renderGemStoneTokens.bind(this)
    this.renderGemStoneToken = this.renderGemStoneToken.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.availableGemStones !== prevProps.availableGemStones) {
      this.setState({
        availableGemStones: new Map(Object.entries(this.props.availableGemStones)),
        isPlayerTurn: this.props.isPlayerTurn,
        playerGemStones: new Map(Object.entries(this.props.playerGemStones)),
      })
    }
  }

  renderGemStoneTokens(tokens, tokenFunc) {
    if (!tokens) {
      return
    }
    return (
      <Row>
        {
          Array.from(tokens.keys())
            .filter((gemStone) => gemStone !== GemStone.GOLD)
            .map((gemstone) => this.renderGemStoneToken(gemstone, tokens.get(gemstone), tokenFunc))
        }
      </Row>
    )
  }

  renderGemStoneToken(gemStone, amount, tokenFunc) {
    return (
      <Col key={gemStone} onClick={() => tokenFunc(gemStone)}>
        <GemStoneToken
          type={gemStone}
          amount={amount}
          width={theme.token.modal.width}
          height={theme.token.modal.height}
        />
      </Col>)
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
        invalidInputError: `Cannot have more than 10 gemstones. You must return ${totalHas - 10} token(s).`
      })
      return;
    }
    if (totalReturned > totalTaken) {
      this.setState({
        invalidInputError: `Cannot return more gemstones than you have taken. Please take ${totalReturned - totalTaken} more token(s).`
      })
      return;
    }
    if (totalOwned + totalTaken < 10 && totalReturned > 0) {
      this.setState({
        invalidInputError: `Cannot return gemstones if your total gemstones will be end up less than 10. Please take those gemstones back.`
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
        ? <InvalidInput>Invalid Input: {this.state.invalidInputError}</InvalidInput>
        : null
    );

    return (
      <TokenModalContainer width={this.props.width}>
        <div>
          <TokensTitle>Available:</TokensTitle>
          {this.renderGemStoneTokens(this.state.availableGemStones, this.onTakeToken)}
        </div>
        {this.state.taken.size > 0
          ? <div>
            <TokensTitle>Taken:</TokensTitle>
            {this.renderGemStoneTokens(this.state.taken, this.onReturnToken)}
          </div>
          : null
        }
        {this.state.returned.size > 0
          ? <div>
            <TokensTitle>Returned:</TokensTitle>
            {this.renderGemStoneTokens(this.state.returned, this.onTakeBackToken)}
          </div>
          : null
        }
        <div>
          <TokensTitle>Yours:</TokensTitle>
          {this.renderGemStoneTokens(this.state.playerGemStones, this.onGiveToken)}
        </div>
        {this.state.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.onPurchaseTokens}>
              Exchange
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
      </TokenModalContainer>
    )
  }
}

export default TokenModal;
