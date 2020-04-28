import React from 'react';
import styled from "styled-components"

const Path = styled.path`
  stroke-width: ${ props => props.strokeWidth ?? 5};
  stroke-opacity: ${ props => props.strokeOpacity ?? 1};
  fill: ${ props => props.fill ?? null};
  fill-opacity: ${ props => props.fill ? 1 : 0};
`;

const RubyPath = styled(Path)`
  stroke: ${ props => props.stroke ?? "red" };
`;

const DiamondPath = styled(Path)`
  stroke: ${ props => props.stroke ?? "white" };
`;

const ChocolatePath = styled(Path)`
  stroke: ${ props => props.stroke ?? "#CB6D51" };
`;

const EmeraldPath = styled(Path)`
  stroke: ${ props => props.stroke ?? "green" };
`;

const SapphirePath = styled(Path)`
  stroke: ${ props => props.stroke ?? "blue" };
`;

export const Ruby = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <RubyPath d="M10 2L2 10L20 38L38 10L30 2L10 2Z" {...others} />
    </svg>
  );
}

export const Diamond = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <DiamondPath d="M20 2L2 18L20 38L37.58 18L20 2Z" {...others} />
    </svg>
  );
}

export const Chocolate = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <ChocolatePath d="M2 10L38 10L37.83 20L25 30L2 30L2 10Z" {...others} />
    </svg>
  );
}

export const Emerald = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <EmeraldPath d="M2 25L2 13L7 9L33 9L38 13L38 25L33 31L7 31L2 25Z" {...others} />
    </svg>
  )
}

export const Sapphire = (props) => {
  const { height, width, ...others } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height={height} width={width}>
      <SapphirePath d="M35 25C32.83 29.5 30.5 32.84 28 35C25.5 37.17 22.84 38.17 20 38C17.17 38.26 14.5 37.26 12 35C9.5 32.74 7.17 29.41 5 25L20 2L35 25Z" {...others} />
    </svg>
  )
}
