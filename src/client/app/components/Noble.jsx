import React from 'react';
import styled from "styled-components"
import { getColorFromGemStone } from '../enums/gemstones.js';

const NobleContainer = styled.div`
  background: ${ props => props.theme.color.black};
  position: relative;
  width: ${ props => `${props.width}rem`};
  height: ${ props => `${props.width}rem`};
  border-radius: 5px;
  font-family: ${ props => props.theme.fontFamily.secondary};
`;

const ScoreOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  color: ${ props => props.theme.color.white};
  padding: ${ props => `${props.width / 24}rem`} ${props => `${props.width / 12}rem`};
  font-size: ${ props => `${props.width/4}rem`};
`;

const RequiredCardsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: ${ props => `${props.width / 30}rem`} ${props => `${props.width / 24}rem`};
`;

const Line = styled.line`
  stroke: ${ props => props.theme.color.white};
  stroke-width: 2;
`;

const RequiredCard = styled.div`
  display: flex;
  align-items: center;
`;

const Card = styled.div`
  background: ${ props => getColorFromGemStone(props.type) ?? props.theme.color.black};
  width: ${ props => `${props.width/10}rem`};
  height: ${ props => `${props.height/10}rem`};
  border: 1px solid ${ props => getColorFromGemStone(props.type) ?? props.theme.color.white};
  border-radius: 2px;
`;

const Amount = styled.span`
  font-size: ${ props => `${props.width/6}rem` };
  color: ${ props => props.theme.color.white};
  padding-right: 0.2rem;
`;

const HorizontalLine = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={`${props.width}rem`}
      height={`${props.height}rem`}
    >
      <Line
        x1={`1.75rem`}
        y1={`0.25rem`}
        x2={`1.75rem`}
        y2={`${props.width-0.25}rem`}
        />
    </svg>
  )
}

class Noble extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      pointValue: this.props.noble.pointValue,
      requiredCards: this.props.noble.requiredCards,
    }
    this.renderRequiredCards = this.renderRequiredCards.bind(this);
    this.renderRequiredCard = this.renderRequiredCard.bind(this);
  }

  renderRequiredCards() {
    return Object.keys(this.state.requiredCards)
      .map((key) => this.renderRequiredCard(key, this.state.requiredCards[key]))
  }

  renderRequiredCard(type, amount) {
    return (
      <RequiredCard key={type}>
        <Amount {...this.props}>{amount}</Amount>
        <Card {...this.props}type={type} />
      </RequiredCard>
    )
  }

  render() {
    return (
      <NobleContainer {...this.props}>
        <HorizontalLine {...this.props}/>
        <ScoreOverlay {...this.props}>{this.state.pointValue}</ScoreOverlay>
        <RequiredCardsOverlay {...this.props}>
          {this.renderRequiredCards()}
        </RequiredCardsOverlay>
      </NobleContainer>
    )
  }
}

export default Noble
