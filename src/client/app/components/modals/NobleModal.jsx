import React from 'react'
import Button from '../../styledcomponents/button.jsx'
import Noble from "../Noble.jsx"
import theme from '../../styledcomponents/theme.jsx'
import ModalContainer from "../../styledcomponents/modal-container.jsx"

class NobleModal extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ModalContainer width={this.props.width}>
        <Noble noble={this.props.noble} width={this.props.width} height={this.props.width}/>
        <p>*You will get nobles automatically if/when eligible</p>
        <div>
          <Button
            color={theme.color.error}
            onClick={this.props.handleClose}>
            Close
          </Button>
        </div>
      </ModalContainer>
    )
  }
}

export default NobleModal
