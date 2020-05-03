import React from 'react';
import styled from "styled-components"
import { getColorFromTier, getNumberFromTier } from '../enums/cardtier'

const Card = styled.div`
  background-color: ${ props => props.theme.color.black};
  position: relative;
  width: ${ props => `${props.width}rem`};
  height: ${ props => `${props.height}rem`};
  box-shadow: inset 0px 0px 0px 2px ${ props => getColorFromTier(props.tier) ?? props.theme.color.white};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  font-family: ${ props => props.theme.fontFamily.secondary};
`;

const Remaining = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: ${ props => `${props.width / 3}rem`};
  line-height: ${ props => `${props.width / 3}rem`};
  font-family: ${ props => props.theme.fontFamily.secondary};
  color: ${ props => props.theme.color.white};
  text-shadow: -1px 1px 0 black,
				  1px 1px 0 black,
				  1px -1px 0 black,
				  -1px -1px 0 black;
`

const CardTitle = styled.div`
  font-size: ${ props => `${props.width / 6}rem`};
  color: ${ props => props.theme.color.white};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const DotContainer = styled.div`
  padding: ${ props => `${props.width / 8}rem`} ${props => `${props.width / 30}rem`};
`

const CardDot = styled.div`
  height: ${ props => `${props.width / 12}rem`};
  width: ${ props => `${props.width / 12}rem`};
  background-color: ${props => getColorFromTier(props.tier) ?? props.tier.color.white};
  border-radius: 50%;
`

const CardDots = (props) => {
  const { tier } = props
  const dots = []
  for (let i = 0; i < getNumberFromTier(tier); i++) {
    dots.push((<DotContainer key={`${i}`} {...props}><CardDot {...props} /></DotContainer>))
  }
  return dots;
}

class TierCard extends React.Component {
  render() {
    return (
      <Card {...this.props}>
        <Remaining {...this.props}>{this.props.remaining}</Remaining>
        <CardDots {...this.props}></CardDots>
        <CardTitle width={this.props.width}>Splendor</CardTitle>
      </Card>
    )
  }
}

export default TierCard;
