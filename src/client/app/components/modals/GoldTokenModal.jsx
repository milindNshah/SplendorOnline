import React from 'react'
import styled from "styled-components";
import theme from '../../styledcomponents/theme.jsx'
import Button from '../../styledcomponents/button.jsx'
import ModalContainer from "../../styledcomponents/modal-container.jsx"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class GoldTokenModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ModalContainer width={this.props.width}>
        <Container>
          <div>*In order to get a gold token, you need to reserve a card.</div>
          <div>
            <Button
              color={theme.color.tertiary}
              onClick={this.props.handleClose}>
              Close
            </Button>
          </div>
        </Container>
      </ModalContainer>
    )
  }
}

export default GoldTokenModal
