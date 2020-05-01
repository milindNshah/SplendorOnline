import React from 'react';
import styled from "styled-components"
import { getColorFromTier, getNumberFromTier } from '../enums/cardtier'

const Card = styled.div`
  background-color: ${ props => props.theme.color.black };
  position: relative;
  width: ${ props => props.theme.card.width };
  height: ${ props => props.theme.card.height };
  box-shadow: inset 0px 0px 0px 2px ${ props => getColorFromTier(props.tier) ?? props.theme.color.white };
  border-radius: 5px;
  display: flex;
  justify-content: center;
  font-family: ${ props => props.theme.fontFamily.secondary };
`;

const CardTitle = styled.div`
  color: ${ props => props.theme.color.white };
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DotContainer = styled.div`
  padding: 0.75rem 0.1rem;
`;

const CardDot = styled.div`
  height: 0.5rem;
  width: 0.5rem;
  background-color: ${props => getColorFromTier(props.tier) ?? props.tier.color.white};
  border-radius: 50%;
`;

const CardDots = (props) => {
  const { tier } = props;
  const dots = [];
  for(let i=0; i<getNumberFromTier(tier); i++) {
    dots.push((<DotContainer key={`${i}`}><CardDot {...props}/></DotContainer>))
  }
  return dots;
}

class TierCard extends React.Component {
  render() {
    return (
      <Card {...this.props}>
        <CardDots {...this.props}></CardDots>
        <CardTitle>Splendor</CardTitle>
      </Card>
    );
  }
}

export default TierCard;
