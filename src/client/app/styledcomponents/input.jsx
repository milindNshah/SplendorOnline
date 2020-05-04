import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: props.type,
}))`
  background-color: ${props => props.backgroundColor ?? props.theme.color.white};
  border: 2px solid ${ props => props.theme.color.inputBorder};
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
  width: ${props => props.width ?? "15rem"};

  &:hover,
  &:focus {
    outline: none;
    border: 2px solid ${props => props.hoverColor ?? props.theme.color.secondary};
  }

  &:invalid {
    border: 2px solid ${ props => props.theme.color.error };
  }

  &::placeholder {
    color: ${ props => props.theme.color.placeHolder };
  }
`
export default Input;
