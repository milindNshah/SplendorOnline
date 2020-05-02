import React from 'react'
import styled from "styled-components"
import Button from '../styledcomponents/button.jsx'
import GemStoneToken from './GemStoneToken.jsx'
import theme from '../styledcomponents/theme.jsx'
import { GemStone } from '../enums/gemstones'

const TokenModalContainer = styled.div`
  padding: 2rem;
  background-color: ${ props => props.theme.color.white};
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

class TokenModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      availableGemStones: new Map(Object.entries(this.props.availableGemStones)),
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
            .filter((gemStone) => gemStone !== GemStone.GOLD )
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
    if(gemStone === GemStone.GOLD) {
      return;
    }
    const totalTaken = Array.from(this.state.taken.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalReturned = Array.from(this.state.returned.values())
      .reduce((acc, amount) => acc += amount, 0)
    const totalChange = totalTaken - totalReturned;
    const takenTwoOfSame = Array.from(this.state.taken.values())
      .reduce((acc, amount) => acc = acc || amount >= 2, false)
    const takenDiffType = Array.from(this.state.taken.keys())
      .reduce((acc, key) => acc = acc || (this.state.taken.get(key) >= 1 && key !== gemStone), false)
    console.log(totalTaken, totalReturned, takenTwoOfSame, takenDiffType)

    if(totalChange >= 3 || totalTaken >= 3) {
      return;
    }
    if(this.state.availableGemStones.get(gemStone) < 1) {
      return;
    }
    if(takenTwoOfSame) {
      return;
    }
    if(this.state.taken.has(gemStone)
      && this.state.taken.get(gemStone) >= 1
      && this.state.availableGemStones.get(gemStone) < 3
    ) {
      return;
    }
    if (this.state.taken.has(gemStone)
      && this.state.taken.get(gemStone) >= 1
      && takenDiffType) {
      return;
    }

    if (this.state.taken.has(gemStone)) {
      this.state.taken.set(gemStone, this.state.taken.get(gemStone) + 1)
    } else {
      this.state.taken.set(gemStone, 1)
    }
    this.state.availableGemStones.set(gemStone, this.state.availableGemStones.get(gemStone)-1)
    this.setState({
      availableGemStones: this.state.availableGemStones,
      taken: this.state.taken,
    })
  }

  onReturnToken(gemStone) {
    if (!this.state.isPlayerTurn) {
      return;
    }
    if(gemStone === GemStone.GOLD) {
      return;
    }
    if (this.state.taken.get(gemStone) <= 1) {
      this.state.taken.delete(gemStone)
    } else {
      this.state.taken.set(gemStone, this.state.taken.get(gemStone) - 1)
    }
    this.state.availableGemStones.set(gemStone, this.state.availableGemStones.get(gemStone)+1)
    this.setState({
      availableGemStones: this.state.availableGemStones,
      taken: this.state.taken,
    })
  }

  onGiveToken(gemStone) {
    // TODO: Complete this
    if (!this.state.isPlayerTurn) {
      return;
    }
    if(gemStone === GemStone.GOLD) {
      return;
    }
    if (this.state.returned.has(gemStone)) {
      this.state.returned.set(gemStone, this.state.returned.get(gemStone) + 1)
    } else {
      this.state.returned.set(gemStone, 1)
    }
    this.state.playerGemStones.set(gemStone, this.state.playerGemStones.get(gemStone)-1)
    this.setState({
      playerGemStones: this.state.playerGemStones,
      returned: this.state.returned,
    })
  }

  onTakeBackToken(gemStone) {
    if (!this.state.isPlayerTurn) {
      return;
    }
    if(gemStone === GemStone.GOLD) {
      return;
    }
    if (this.state.returned.get(gemStone) <= 1) {
      this.state.returned.delete(gemStone)
    } else {
      this.state.returned.set(gemStone, this.state.returned.get(gemStone) - 1)
    }
    this.playerGemStones.set(gemStone, this.state.playerGemStones.get(gemStone)+1)
    this.setState({
      playerGemStones: this.state.playerGemStones,
      returned: this.state.returned,
    })
  }

  onPurchaseTokens() {
    this.props.handlePurchaseTokens(this.state.taken, this.state.returned)
    this.setState({
      taken: new Map()
    })
  }

  render() {
    return (
      <TokenModalContainer>
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
          <TokensTitle>Owned:</TokensTitle>
          {this.renderGemStoneTokens(this.state.playerGemStones, this.onGiveToken)}
        </div>
        {this.state.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.onPurchaseTokens}>
              Take Tokens
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
      </TokenModalContainer>
    )
  }
}

export default TokenModal;
