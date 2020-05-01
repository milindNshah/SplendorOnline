import styled from "styled-components";
import Button from './button.jsx';

const FilledButton = styled(Button)`
  background-color: ${ props => props.color ?? props.theme.color.primary };
  border: 1px solid ${ props => props.color ?? props.theme.color.primary };
  color: ${ props => props.theme.color.white };

  &:hover,
  &:focus {
    outline: none;
  }
`;

export default FilledButton
