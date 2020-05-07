import React from 'react'

export default class Timer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initialMinutes: 0,
      initialSeconds: 10,
      currentMinutes: 0,
      currentSeconds: 10,
    }
    this.startTimer = this.startTimer.bind(this)
  }

  componentDidMount() {
    this.startTimer()
  }

  componentWillUnmount() {
    clearInterval(this.myInterval)
  }

  startTimer() {
    this.myInterval = setInterval(() => {
      let currentSeconds = this.state.currentSeconds;
      let currentMinutes = this.state.currentMinutes;
      if (currentSeconds > 0) {
        this.setState({
          currentSeconds: currentSeconds - 1
        })
      }
      if (currentSeconds === 0) {
        if (currentMinutes === 0) {
          this.props.handleTimerDone()
          clearInterval(this.myInterval)
          this.setState({
            currentMinutes: this.state.initialMinutes,
            currentSeconds: this.state.initialSeconds,
          })
          this.startTimer();
        } else {
          this.setState({
            minutes: minutes - 1,
            seconds: 59
          })
        }
      }
    }, 1000)
  }

  render() {
    let minutes = this.state.currentMinutes;
    let seconds = this.state.currentSeconds;
    // const { minutes, seconds } = this.state
    return (
      <div>
        {minutes === 0 && seconds === 0
          ? null
          : <h1>Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
        }
      </div>
    )
  }
}
