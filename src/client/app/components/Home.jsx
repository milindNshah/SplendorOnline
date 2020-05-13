import React from 'react'
import styled from 'styled-components'
import { ThemeProvider } from 'styled-components'
import theme from '../styledcomponents/theme.jsx'
import Button from '../styledcomponents/button.jsx'

const HomeContainer = styled.div`
  margin-top: 10vh;
  text-align: center;
`

class Home extends React.Component {
  constructor (props) {
    super(props)
    this.onCreateRoom = this.onCreateRoom.bind(this)
    this.onJoinRoom = this.onJoinRoom.bind(this)
  }

  onCreateRoom() {
    this.props.history.push('/room', { isCreateRoom: true });
  }

  onJoinRoom() {
    this.props.history.push('/room', { isJoinRoom: true });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <HomeContainer>
          <h1>Welcome to Splendor Online</h1>
          <h2>A resource-based card-building game</h2>
          <div>
            <Button onClick={this.onCreateRoom}>
              Create Game
            </Button>
          </div>
          <div>
            <Button onClick={this.onJoinRoom} color={theme.color.secondary}>
              Join Game
            </Button>
          </div>
        </HomeContainer>
      </ThemeProvider>
    );
  }
}

export default Home;
