import React from 'react'
import styled from 'styled-components'
import { socket } from '../socket'

const Time = styled.div`
  color: ${ props => props.minutes === 0 && props.seconds <= 15
    ? props.seconds % 2 === 0
      ? props.theme.color.white
      : props.theme.color.error
    : props.theme.color.darkgrey
  };
  border: 1px solid ${ props => props.minutes === 0 && props.seconds <= 15
    ? props.seconds % 2 === 0
      ? props.theme.color.error
      : props.theme.color.error
    : props.theme.color.darkgrey
  };
  background-color: ${ props => props.minutes === 0 && props.seconds <= 15
    ? props.seconds % 2 === 0
      ? props.theme.color.error
      : props.theme.color.white
    : props.theme.color.white
  };
  font-size: 1.5rem;
  font-family: ${ props => props.theme.fontFamily.tertiary};
  font-weight: 300;
  padding: 0.25rem 0.5rem;
  width: 5rem;
  text-align: center;
`

class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      timeleft: {
        minutes: 2,
        seconds: 0,
      },
    }
    this.socket = socket;
    this.onTimerUpdate = this.onTimerUpdate.bind(this)
  }

  componentDidMount() {
    this.socket.on('TimerUpdate', this.onTimerUpdate)
  }

  componentWillUnmount() {
    this.socket.off('TimerUpdate', this.onTimerUpdate);
  }

  onTimerUpdate(data) {
    this.setState({
      timeleft: data,
    })
  }

  render() {
    const Timer = () => (this.state.timeleft.minutes === 0 && this.state.timeleft.seconds === 0
      ? <Time seconds={this.state.timeleft.seconds} minutes={this.state.timeleft.minutes}>0:00</Time>
      : <Time seconds={this.state.timeleft.seconds} minutes={this.state.timeleft.minutes}>
        {this.state.timeleft.minutes}:{this.state.timeleft.seconds < 10 ? `0${this.state.timeleft.seconds}` : this.state.timeleft.seconds}
      </Time>
    )

    return (
      <Timer/>
    )
  }
}

export default Timer;
