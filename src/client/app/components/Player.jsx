import React from 'react';
import styled from 'styled-components'

const PlayerContainer = styled.div`
  display: flex;
  justify-content: center;
`
const PlayerWidthContainer = styled.div`
  width: ${ props => `${props.theme.board.width}rem`};
  min-width: ${ props => `${props.theme.board.width}rem`};
`
const PlayerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSize};
`
const NameCol = styled.p`
  width: ${ props => props.theme.player.nameColWidth};
`
const IconCol = styled.p`
  color: ${ props => props.expanded ? props.theme.color.error : props.theme.color.secondary};
  width: ${ props => props.theme.player.iconColWidth};
`
const ScoreCol = styled.p`
  width: ${ props => props.theme.player.scoreColWidth};
`

class Player extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hand: this.props.player?.hand,
      isPlayerTurn: this.props.player?.isPlayerTurn,
      playerID: this.props.player?.id,
      playerName: this.props.player?.user?.name,
      expandInfo: false,
    }
    this.onExpandInfo = this.onExpandInfo.bind(this)
    this.onCloseInfo = this.onCloseInfo.bind(this)
    this.renderExtraInfo = this.renderExtraInfo.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props.player !== prevProps.player) {
      this.setState({
        hand: this.props.player.hand,
        isPlayerTurn: this.props.player.isPlayerTurn,
        playerID: this.props.player.id,
        playerName: this.props.player.user.name,
      });
    }
  }

  onExpandInfo() {
    this.setState({
      expandInfo: true,
    })
  }

  onCloseInfo() {
    this.setState({
      expandInfo: false,
    })
  }

  renderExtraInfo() {
    return (<div>More Info</div>)
  }

  render() {
    return (
      <PlayerContainer>
        <PlayerWidthContainer>
          <PlayerHeader>
            <NameCol>{this.state.playerName}</NameCol>
            <ScoreCol>Score: {this.state.hand.score}</ScoreCol>
            {
              this.state.expandInfo
                ? <IconCol expanded="true"><span onClick={this.onCloseInfo}><i className="fa fa-minus"></i></span></IconCol>
                : <IconCol><span onClick={this.onExpandInfo}><i className="fa fa-plus"></i></span></IconCol>
            }
          </PlayerHeader>
          {this.state.expandInfo
            ? this.renderExtraInfo()
            : null
          }
        </PlayerWidthContainer>
      </PlayerContainer>
    )
  }
}

export default Player
