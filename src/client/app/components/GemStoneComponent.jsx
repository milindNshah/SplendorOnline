import React from 'react';
import styled from "styled-components"
import { GemStone, GemStoneToColor } from '../enums/gemstones.js';

const Path = styled.path`
  stroke-width: ${ props => props.strokeWidth ?? 5};
  stroke-opacity: ${ props => props.strokeOpacity ?? 1};
  fill: ${ props => props.fill ?? null};
  fill-opacity: ${ props => props.fill ? 1 : 0};
`;

const RubyPath = styled(Path)`
  stroke: ${ props => props.stroke ?? GemStoneToColor.RUBY };
`;

const DiamondPath = styled(Path)`
  stroke: ${ props => props.stroke ?? GemStoneToColor.DIAMOND };
`;

const ChocolatePath = styled(Path)`
  stroke: ${ props => props.stroke ?? GemStoneToColor.CHOCOLATE };
`;

const EmeraldPath = styled(Path)`
  stroke: ${ props => props.stroke ?? GemStoneToColor.EMERALD };
`;

const SapphirePath = styled(Path)`
  stroke: ${ props => props.stroke ?? GemStoneToColor.SAPPHIRE };
`;

const Amount = styled.span`
  font-size: ${ props => props.amount ?? "0.75rem"};
  color: ${ props => props.color ?? "white" };
  padding-right: 0.2rem;
`;

const Ruby = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <RubyPath d="M10 2L2 10L20 38L38 10L30 2L10 2Z" {...others} />
    </svg>
  );
}

const Diamond = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <DiamondPath d="M20 2L2 18L20 38L37.58 18L20 2Z" {...others} />
    </svg>
  );
}

const Chocolate = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <ChocolatePath d="M2 10L38 10L37.83 20L25 30L2 30L2 10Z" {...others} />
    </svg>
  );
}

const Emerald = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <EmeraldPath d="M2 25L2 13L7 9L33 9L38 13L38 25L33 31L7 31L2 25Z" {...others} />
    </svg>
  )
}

const Sapphire = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <SapphirePath d="M35 25C32.83 29.5 30.5 32.84 28 35C25.5 37.17 22.84 38.17 20 38C17.17 38.26 14.5 37.26 12 35C9.5 32.74 7.17 29.41 5 25L20 2L35 25Z" {...others} />
    </svg>
  )
}

export const GemStoneComponent = (props) => {
  const GetGemStone = (props) => {
    const { amount, type } = props;
    if (amount) {
      return (
        <div>
          <Amount>{amount}</Amount>
          {GetSoloGemStone(props)}
        </div>
      );
    }
    return GetSoloGemStone(props);
  }

  const GetSoloGemStone = (props) => {
    const { type, ...others } = props;
    switch (type) {
      case GemStone.CHOCOLATE:
        return <Chocolate {...others} />;
      case GemStone.DIAMOND:
        return <Diamond {...others} />;
      case GemStone.GOLD:
        return <Gold {...others} />;
      case GemStone.EMERALD:
        return <Emerald {...others} />;
      case GemStone.RUBY:
        return <Ruby {...others} />;
      case GemStone.SAPPHIRE:
        return <Sapphire {...others} />;
      default:
        return <div></div>
    }
  }

  return (
    <GetGemStone {...props} />
  );
}
