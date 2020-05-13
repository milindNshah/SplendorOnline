import React from 'react'
import Button from '../../styledcomponents/button.jsx'
import Noble from "../Noble.jsx"
import theme from '../../styledcomponents/theme.jsx'
import styled from "styled-components";
import ModalContainer from "../../styledcomponents/modal-container.jsx"

const NobleModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

class NobleModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ModalContainer width={this.props.width}>
        <NobleModalContainer>
          <Noble noble={this.props.noble} width={this.props.width} height={this.props.width} />
          <p>*You will get nobles automatically if/when eligible</p>
          <div>
            <Button
              color={theme.color.tertiary}
              onClick={this.props.handleClose}>
              Close
            </Button>
          </div>
        </NobleModalContainer>
      </ModalContainer>
    )
  }
}

export default NobleModal
