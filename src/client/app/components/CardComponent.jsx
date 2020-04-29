import React from 'react';
import styled from "styled-components"
import { GemStoneComponent } from './GemStoneComponent.jsx'
import { getColorFromGemStone } from '../enums/gemstones.js'

const Card = styled.div`
  background: black;
  position: relative;
  /*Ratio of 3:4*/
  width: 90px;
  height: 120px;
  border: 2px solid white;
  border-radius: 5px;
`;

const Svg = styled.svg`
  /* Same as Card */
  width: 90px;
  height: 120px;
`;

const Line = styled.line`
  stroke: white;
  stroke-width: 2;
`;

const ScoreOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  padding: 0 0.5rem;
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

class CardComponent extends React.Component {
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
    return Array.from(this.state.requiredGemStones.keys())
      .map((key) => this.renderRequiredGemStone(key, this.state.requiredGemStones.get(key)));
  }

  renderRequiredGemStone(type, amount) {
    return (
      <GemStoneComponent key={type} type={type} amount={amount} width='0.75rem' height='0.75rem' />
    )
  }

  render() {
    return (
      <Card color={getColorFromGemStone(this.state.gemStoneType)}>
        <Svg xmlns="http://www.w3.org/2000/svg">
          {/* TODO: Make Line it's own component (svg) and use width/height to generate it */}
          <Line x1="10" y1="110" x2="80" y2="10" />
        </Svg>
        <ScoreOverlay><span>{this.state.pointValue}</span>
          <GemStoneComponent type={this.state.gemStoneType} width='1rem' height='1rem' fill={this.props.fill} />
        </ScoreOverlay>
        <RequiredGemStonesOverlay>
          {this.renderRequiredGemStones()}
        </RequiredGemStonesOverlay>
      </Card>
    );
  }
}



export default CardComponent;
