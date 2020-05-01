import React from 'react';
import styled from "styled-components"
import { GemStoneBase } from './GemStone.jsx'
import theme from '../styledcomponents/theme.jsx'

const CardContainer = styled.div`
  background: ${ props => props.theme.color.black};
  position: relative;
  width: ${ props => props.theme.card.width};
  height: ${ props => props.theme.card.height};
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
  padding: 0.25rem 0.5rem;
  font-size: ${ props => props.theme.card.scoreFontSize};
  font-family: ${ props => props.theme.fontFamily.secondary};
`;

const RequiredGemStonesOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.1rem 0.25rem;
`;

const DiagonalLine = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={theme.card.width}
      height={theme.card.height}
    >
      <Line
        x1={theme.card.diagonalLine.x1}
        y1={theme.card.diagonalLine.y1}
        x2={theme.card.diagonalLine.x2}
        y2={theme.card.diagonalLine.y2}
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
        width={theme.card.gemStone.width}
        height={theme.card.gemStone.height}
        fill="true"
      />
    )
  }

  render() {
    return (
      <CardContainer>
        <DiagonalLine />
        <ScoreOverlay><span>{this.state.pointValue}</span>
          <GemStoneBase
            type={this.state.gemStoneType}
            width={theme.card.gemStoneType.width}
            height={theme.card.gemStoneType.height}
            fill="true"
          />
        </ScoreOverlay>
        <RequiredGemStonesOverlay>
          {this.renderRequiredGemStones()}
        </RequiredGemStonesOverlay>
      </CardContainer>
    );
  }
}



export default Card;
