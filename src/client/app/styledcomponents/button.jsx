import styled from "styled-components";

const Button = styled.button`
  appearance: none;
  background-color: ${ props => props.theme.color.white };
  border: 1px solid ${ props => props.color ?? props.theme.color.primary };
  border-radius: 0.25rem;
  color: ${ props => props.color ?? props.theme.color.primary };
  cursor: pointer;
  display: inline-block;
  height: auto;
  font-family: ${ props => props.fontFamily ?? props.theme.fontFamily.primary };
  font-size: ${ props => props.fontSize ?? props.theme.fontSize };
  font-weight: 400;
  line-height: 1.5rem;
  margin: 0.5rem 0;
  opacity: 1;
  outline: none;
  padding: 0.25rem 1rem;
  position: relative;
  text-align: center;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: ${props => props.width ?? "9rem"};

  &:hover,
  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${ props => props.color ?? props.theme.color.primary };
    color: ${ props => props.theme.color.white };
  }
`;

export default Button;
