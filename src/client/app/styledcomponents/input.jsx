import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: props.type,
}))`
  background-color: ${props => props.backgroundColor ?? props.theme.color.white};
  border: 2px solid ${ props => props.theme.input.borderColor};
  border-radius: 0.25rem;
  color: ${props => props.color ?? props.theme.color.black};
  display: inline-block;
  font-size: ${ props => props.fontSize ?? props.theme.fontSize };
  font-weight: 400;
  height: "auto";
  line-height: 1.5rem;
  padding: 0.25rem 0.5rem;
  margin: 0.5rem 0;
  outline: none;
  width: ${props => props.width ?? props.theme.input.width};

  &:hover,
  &:focus {
    outline: none;
    border: 2px solid ${props => props.hoverColor ?? props.theme.input.hoverColor};
  }

  &:invalid {
    border: 2px solid ${ props => props.theme.input.errorColor };
  }

  &::placeholder {
    color: ${ props => props.theme.input.placeHolderColor };
  }
`
export default Input;
