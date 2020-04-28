import React from 'react';
import styled from "styled-components"
import { Ruby, Diamond, Chocolate, Emerald, Sapphire } from './GemStoneComponent.jsx'

const Card = styled.div`
  background: black;
  position: relative;
  /*Ratio of 3:4*/
  width: 90px;
  height: 120px;
  box-shadow: inset 0px 0px 0px 1px ${ props => props.color ?? "black"};
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

const GemStoneType = styled.div`
  position: absolute;
  top:1.5rem;
  left:0.3rem; /* TODO: Need to figure out how to center */
  width:100%;
  height:100%;
`;

const Score = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  padding: 0 0.5rem; /* TODO: Need to figure out how to center */
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
  }

  render() {
    return (
      <Card color="green">
        <Svg xmlns="http://www.w3.org/2000/svg">
          {/* TODO: Make Line it's own component (svg) and use width/height to generate it */}
          <Line x1="10" y1="110" x2="80" y2="10" />
        </Svg>
        <Score><span>{this.state.pointValue}</span></Score>
        <GemStoneType><Emerald width='1rem' height='1rem'/></GemStoneType>
      </Card>
    );
  }
}



export default CardComponent;
