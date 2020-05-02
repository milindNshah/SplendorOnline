import React from 'react'
import styled from "styled-components"
import Button from '../styledcomponents/button.jsx'
import Card from './Card.jsx'
import theme from '../styledcomponents/theme.jsx'

const CardModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background-color: ${ props => props.theme.color.white};
`

class CardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      card: this.props.card,
      isPlayerTurn: this.props.isPlayerTurn,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.card !== prevProps.card) {
      this.setState({
        card: this.props.card,
        isPlayerTurn: this.props.isPlayerTurn,
      })
    }
  }

  render() {
    if (!this.state.card) {
      return <div></div>;
    }
    return (
      <CardModalContainer>
        <Card card={this.state.card} width={theme.card.modal.width} height={theme.card.modal.height} />
        {this.state.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.primary}
              onClick={this.props.handlePurchaseCard}>
              Purchase Card
          </Button>
          </div>
          : null
        }
        {this.state.isPlayerTurn ?
          <div>
            <Button
              color={theme.color.secondary}
              onClick={this.props.handleReserveCard}>
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
      </CardModalContainer>)
  }
}

export default CardModal;
