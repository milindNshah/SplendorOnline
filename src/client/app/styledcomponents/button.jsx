import styled from "styled-components";

const Button = styled.button`
  appearance: none;
  background-color: ${ props => props.backgroundColor ?? "white" };
  border: 1px solid ${ props => props.backgroundColor ?? "white" };
  border-radius: ${ props => props.borderRadius };
  color: ${ props => props.color ?? "black"};
  cursor: pointer;
  display: inline-block;
  font-size: ${ props => props.fontSize ?? "1rem" };
  user-select: none;
  opacity: 0.7;
  outline: none;
  padding: 0.25em 1em;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: ${props => props.width ? props.width : "auto"};

  &:hover,
  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 1;
  }
`;

export default Button;
