import styled from "styled-components";

const Button = styled.button`
  appearance: none;
  background-color: white;
  border: 1px solid ${ props => props.color ?? "black" };
  border-radius: 0.25rem;
  color: ${ props => props.color ?? "black"};
  cursor: pointer;
  display: inline-block;
  height: ${props => props.height ? props.width : "auto"};
  font-family: ${ props => (props.fontFamily || 'Raleway'), "helvetica", "sans-serif"};
  font-size: ${ props => props.fontSize ?? "1rem" };
  font-weight: 400;
  line-height: 1.5rem;
  margin-top: 0.5rem;
  opacity: 1;
  outline: none;
  padding: 0.25rem 1rem;
  position: relative;
  text-align: center;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
  width: ${props => props.width ? props.width : "auto"};

  &:hover,
  &:focus {
    outline: none;
  }

  &:hover {
    background-color: ${ props => props.color ?? "black" };
    opacity: 1;
    color: white;
  }
`;

export default Button;
