import React from 'react';
import styled from "styled-components"
import { getColorFromGemStone } from '../enums/gemstones.js';

const Noble = styled.div`
  background: black;
  position: relative;
  /* From CardComponent.jsx */
  width: 90px;
  height: 90px;
  border: 2px solid white;
  border-radius: 5px;
`;

const ScoreOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  color: white;
  padding: 0 0.5rem;
`;

const RequiredCardsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 0.1rem 0.25rem;
`;

const Svg = styled.svg`
  /* Same as Card */
  width: 90px;
  height: 90px;
`;

const Line = styled.line`
  stroke: white;
  stroke-width: 2;
`;

const RequiredCard = styled.div`
  display: flex;
  align-items: center;
`;

const Card = styled.div`
  background: black;
  /*Ratio of 3:4*/
  width: 0.6rem;
  height: 0.8rem;
  border: 1px solid ${ props => props.type ? getColorFromGemStone(props.type) : "white"};
  border-radius: 2px;
`;

const Amount = styled.span`
  font-size: ${ props => props.fontSize ?? "0.75rem"};
  color: ${ props => props.color ?? "white" };
  padding-right: 0.2rem;
`;

class NobleComponent extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      pointValue: this.props.noble.pointValue,
      requiredCards: this.props.noble.requiredCards,
    }
    this.renderRequiredCards = this.renderRequiredCards.bind(this);
    this.renderRequiredCard = this.renderRequiredCard.bind(this);
  }

  renderRequiredCards() {
    return Array.from(this.state.requiredCards.keys())
      .map((key) => this.renderRequiredCard(key, this.state.requiredCards.get(key)))
  }

  renderRequiredCard(type, amount) {
    return (
    <RequiredCard>
      <Amount>{amount}</Amount>
      <Card key={type} type={type}/>
    </RequiredCard>
    )
  }

  render() {
    return (
      <Noble>
        <Svg xmlns="http://www.w3.org/2000/svg">
          {/* TODO: Make Line it's own component (svg) and use width/height to generate it */}
          <Line x1="1.5rem" y1="0.25rem" x2="1.5rem" y2="80"/>
        </Svg>
        <ScoreOverlay>{this.state.pointValue}</ScoreOverlay>
        <RequiredCardsOverlay>
          {this.renderRequiredCards()}
        </RequiredCardsOverlay>
      </Noble>
    )
  }
}

export default NobleComponent
