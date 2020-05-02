import React from 'react';
import styled from "styled-components"
import { getColorFromGemStone } from '../enums/gemstones.js';
import theme from '../styledcomponents/theme.jsx'

const NobleContainer = styled.div`
  background: ${ props => props.theme.color.black};
  position: relative;
  width: ${ props => props.theme.card.width};
  height: ${ props => props.theme.card.width};
  border-radius: 5px;
  font-family: ${ props => props.theme.fontFamily.secondary};
`;

const ScoreOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  color: white;
  padding: 0 0.5rem;
  font-size: ${ props => props.theme.card.score.fontSize };
`;

const RequiredCardsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 0.1rem 0.25rem;
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
  width: ${ props => props.theme.card.icon.width};
  height: ${ props => props.theme.card.icon.height};
  border: 1px solid ${ props => getColorFromGemStone(props.type) ?? props.theme.color.white};
  border-radius: 2px;
`;

const Amount = styled.span`
  font-size: ${ props => props.theme.amount.fontSize };
  color: ${ props => props.color ?? props.theme.color.white};
  padding-right: 0.2rem;
`;

const HorizontalLine = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      width={theme.card.width}
      height={theme.card.height}
    >
      <Line
        x1={theme.card.horizontalLine.x1}
        y1={theme.card.horizontalLine.y1}
        x2={theme.card.horizontalLine.x2}
        y2={theme.card.horizontalLine.y2}
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
        <Amount>{amount}</Amount>
        <Card type={type} />
      </RequiredCard>
    )
  }

  render() {
    return (
      <NobleContainer>
        <HorizontalLine />
        <ScoreOverlay>{this.state.pointValue}</ScoreOverlay>
        <RequiredCardsOverlay>
          {this.renderRequiredCards()}
        </RequiredCardsOverlay>
      </NobleContainer>
    )
  }
}

export default Noble
