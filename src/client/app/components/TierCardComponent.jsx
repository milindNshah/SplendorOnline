import React from 'react';
import styled from "styled-components"
import { getColorFromTier, getNumberFromTier } from '../enums/cardtier'

const Card = styled.div`
  background-color: black;
  position: relative;
  /*Ratio of 3:4 - copied from CardComponent*/
  width: 90px;
  height: 120px;
  box-shadow: inset 0px 0px 0px 2px ${ props => props.tier ? getColorFromTier(props.tier) : "white"};
  border-radius: 5px;
  display: flex;
  justify-content: center;
`;

const CardTitle = styled.div`
  color: white;
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
  padding: 0.4rem 0.1rem;
`;

const CardDot = styled.div`
  height: 0.5rem;
  width: 0.5rem;
  background-color: ${props => props.tier ? getColorFromTier(props.tier) : "white"};
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

class TierCardComponent extends React.Component {
  render() {
    return (
      <Card {...this.props}>
        <CardDots {...this.props}></CardDots>
        <CardTitle>Splendor</CardTitle>
      </Card>
    );
  }
}

export default TierCardComponent;
