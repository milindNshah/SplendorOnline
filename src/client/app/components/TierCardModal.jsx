import React from 'react'
import styled from "styled-components"
import Button from '../styledcomponents/button.jsx'
import TierCard from "./TierCard.jsx"
import theme from '../styledcomponents/theme.jsx'

const TierCardModalContainer = styled.div`
  max-width: ${ props => `${props.width}rem`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${ props => props.theme.color.white};
`
const InvalidInput = styled.p`
  padding: 1rem;
  color: ${ props => props.theme.color.error};
  text-align: left;
`

class TierCardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isPlayerTurn: this.props.isPlayerTurn,
      playerReservedCards: this.props.playerReservedCards,
      invalidInputError: null,
    }
    this.onReserveCard = this.onReserveCard.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.playerReservedCards !== prevProps.playerReservedCards ||
      this.props.isPlayerTurn !== prevProps.isPlayerTurn) {
      this.setState({
        isPlayerTurn: this.props.isPlayerTurn,
        playerReservedCards: this.props.playerReservedCards,
      })
    }
  }

  onReserveCard() {
    if (Object.keys(this.state.playerReservedCards).length >= 3) {
      this.setState({
        invalidInputError: `Unable to reserve. You may only have 3 reserved cards.`
      })
      return;
    }
    this.props.handleReserveCard()
  }

  render() {
    const InvalidInputError = () => (
      this.state.invalidInputError
        ? <InvalidInput>Invalid Input: {this.state.invalidInputError}</InvalidInput>
        : null
    );

    return (
      <TierCardModalContainer width={this.props.width}>
        <TierCard
          tier={this.props.tier}
          remaining={this.props.remaining}
          width={theme.card.modal.width}
          height={theme.card.modal.height} />
        {this.state.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.onReserveCard}>
              Reserve Card
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
      </TierCardModalContainer>
    )
  }
}

export default TierCardModal
