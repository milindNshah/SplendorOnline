import React from 'react'
import styled from "styled-components"
import Button from '../styledcomponents/button.jsx'
import Noble from "./Noble.jsx"
import theme from '../styledcomponents/theme.jsx'

const NobleModalContainer = styled.div`
  max-width: ${ props => `${props.width}rem`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: ${ props => props.theme.color.white};
`

class NobleModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <NobleModalContainer width={this.props.width}>
        <Noble noble={this.props.noble} width={theme.card.modal.width} height={theme.card.modal.width}/>
        <p>*You will get this automatically if/when eligible</p>
        <div>
          <Button
            color={theme.color.error}
            onClick={this.props.handleClose}>
            Close
          </Button>
        </div>
      </NobleModalContainer>
    )
  }
}

export default NobleModal
