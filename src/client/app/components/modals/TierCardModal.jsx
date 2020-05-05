import React from 'react'
import styled from "styled-components"
import Button from '../../styledcomponents/button.jsx'
import TierCard from "../TierCard.jsx"
import theme from '../../styledcomponents/theme.jsx'
import ModalContainer from "../../styledcomponents/modal-container.jsx"

const MaxThreeReservedCardsError = `Unable to reserve. You may only have 3 reserved cards.`

const ErrorMessage = styled.p`
  margin: 0.5rem 0;
`
const TierCardContainer = styled.div`
  margin-bottom: 1rem;
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
        invalidInputError: MaxThreeReservedCardsError
      })
      return;
    }
    this.props.handleReserveCard()
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
            width={this.props.width}
            height={this.props.height} />
        </TierCardContainer>
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
      </ModalContainer>
    )
  }
}

export default TierCardModal
