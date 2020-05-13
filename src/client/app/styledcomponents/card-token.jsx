import styled from "styled-components";
import { getColorFromGemStone } from '../enums/gemstones'

const CardToken = styled.div`
  background: ${ props => props.theme.color.black };
  width: ${ props => `${props.width}rem` };
  height: ${ props => `${props.height}rem` };
  color: ${ props => props.theme.color.white };
  border-radius: 5px;
  box-shadow: inset 0px 0px 0px 2px ${ props => getColorFromGemStone(props.type) };
  margin-top: 0.5rem;
  font-size: 1.5rem;
  font-family: ${ props => props.theme.fontFamily.secondary };
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${ props => props.isClickable ? "pointer" : "default" };
  opacity: ${ props => props.opacity ?? 1};
`;

export default CardToken
