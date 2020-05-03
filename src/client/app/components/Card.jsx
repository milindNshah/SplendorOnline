import React from 'react';
import styled from "styled-components"
import { GemStoneBase } from './GemStone.jsx'

const CardContainer = styled.div`
  background: ${ props => props.theme.color.black};
  position: relative;
  width: ${ props => `${props.width}rem`};
  height: ${ props => `${props.height}rem`};
  border-radius: 5px;
`;

const Line = styled.line`
  stroke: ${ props => props.theme.color.white};
  stroke-width: 2;
`;

const ScoreOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${ props => props.theme.color.white};
  padding: ${ props => `${props.width / 24}rem`} ${props => `${props.width / 12}rem`};
  font-size: ${ props => `${props.width / 4}rem`};
  font-family: ${ props => props.theme.fontFamily.secondary};
`;

const RequiredGemStonesOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${ props => `${props.width / 30}rem`} ${props => `${props.width / 24}rem`};
`;

const DiagonalLine = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={`${props.width}rem`}
      height={`${props.height}rem`}
    >
      <Line
        x1={`0.5rem`}
        y1={`${props.height-0.5}rem`}
        x2={`${props.width-0.5}rem`}
        y2={`0.5rem`}
      />
    </svg>
  );
}

class Card extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tier: this.props.card.tier,
      pointValue: this.props.card.pointValue,
      gemStoneType: this.props.card.gemStoneType,
      requiredGemStones: this.props.card.requiredGemStones,
    }
    this.renderRequiredGemStones = this.renderRequiredGemStones.bind(this);
    this.renderRequiredGemStone = this.renderRequiredGemStone.bind(this);
  }

  renderRequiredGemStones() {
    return Object.keys(this.state.requiredGemStones)
      .map((key) => this.renderRequiredGemStone(key, this.state.requiredGemStones[key]));
  }

  renderRequiredGemStone(type, amount) {
    return (
      <GemStoneBase
        key={type}
        type={type}
        amount={amount}
        width={this.props.height / 10}
        height={this.props.height / 10}
        fill="true"
      />
    )
  }

  render() {
    return (
      <CardContainer {...this.props}>
        <DiagonalLine {...this.props}/>
        <ScoreOverlay {...this.props}><span>{this.state.pointValue}</span>
          <GemStoneBase
            type={this.state.gemStoneType}
            width={this.props.height / 6}
            height={this.props.height / 6}
            fill="true"
          />
        </ScoreOverlay>
        {this.props.doNotRenderRequired
          ? null
          : <RequiredGemStonesOverlay {...this.props}>{this.renderRequiredGemStones()}</RequiredGemStonesOverlay>
        }
      </CardContainer>
    );
  }
}



export default Card;
