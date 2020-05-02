import React from 'react';
import styled from "styled-components"
import { GemStone, getColorFromGemStone } from '../enums/gemstones.js';

const Path = styled.path`
  stroke: ${ props => getColorFromGemStone(props.type) ?? props.theme.color.white};
  stroke-width: 5;
  stroke-opacity: 1;
  fill: ${ props => getColorFromGemStone(props.type) ?? null};
`;

const Amount = styled.span`
  font-family: ${ props => props.theme.fontFamily.secondary };
  font-size: ${ props => `${props.width/5}rem` };
  color: ${ props => props.color ?? props.theme.color.white};
  padding-right: ${ props => `${props.width/15}rem` };
`;

const GemStoneContainer = styled.div`
  display: flex;
  align-items: center;
`

const Chocolate = (props) => {
  const { height, width } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <Path d="M2 10L38 10L37.83 20L25 30L2 30L2 10Z" type={props.type} />
    </svg>
  );
}

const Diamond = (props) => {
  const { height, width } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <Path d="M20 2L2 18L20 38L37.58 18L20 2Z" type={props.type} />
    </svg>
  );
}

const Emerald = (props) => {
  const { height, width } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <Path d="M2 25L2 13L7 9L33 9L38 13L38 25L33 31L7 31L2 25Z" type={props.type} />
    </svg>
  )
}

const Gold = (props) => {
  const { height, width } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <Path d="M2 31L38 31L30 9L10 9L2 31Z" type={props.type} />
    </svg>
  )
}

const Ruby = (props) => {
  const { height, width } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <Path d="M10 2L2 10L20 38L38 10L30 2L10 2Z" type={props.type} />
    </svg>
  );
}

const Sapphire = (props) => {
  const { height, width } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <Path d="M35 25C32.83 29.5 30.5 32.84 28 35C25.5 37.17 22.84 38.17 20 38C17.17 38.26 14.5 37.26 12 35C9.5 32.74 7.17 29.41 5 25L20 2L35 25Z" type={props.type} />
    </svg>
  )
}

const GetSoloGemStone = (props) => {
  const { type } = props;
  switch (type) {
    case GemStone.CHOCOLATE:
      return <Chocolate {...props} />;
    case GemStone.DIAMOND:
      return <Diamond {...props} />;
    case GemStone.GOLD:
      return <Gold {...props} />;
    case GemStone.EMERALD:
      return <Emerald {...props} />;
    case GemStone.RUBY:
      return <Ruby {...props} />;
    case GemStone.SAPPHIRE:
      return <Sapphire {...props} />;
    default:
      return <div></div>
  }
}

export const GemStoneBase = (props) => {
  const { amount } = props;
  if (amount) {
    return (
      <GemStoneContainer>
        <Amount {...props}>{amount}</Amount>
        <GetSoloGemStone {...props}/>
      </GemStoneContainer>
    );
  }
  return (<GetSoloGemStone {...props}/>);
}
