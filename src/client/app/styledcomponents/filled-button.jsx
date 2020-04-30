import styled from "styled-components";
import Button from './button.jsx';

const FilledButton = styled(Button)`
  background-color: ${ props => props.color ?? "black"};
  border: 1px solid ${ props => props.color ?? "black" };
  color: white;
  opacity: 1;

  &:hover,
  &:focus {
    outline: none;
    opacity: 1;
  }
`;

export default FilledButton
