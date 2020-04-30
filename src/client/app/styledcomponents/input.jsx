import styled from "styled-components";

const Input = styled.input.attrs(props => ({
  type: props.type,
}))`
  background-color: ${props => props.backgroundColor || "white"};
  border: 2px solid #BCBCBC;
  border-radius: 0.25rem;
  color: ${props => props.color || "black"};
  display: block;
  font-family: 'Raleway', helvetica, sans-serif;
  font-size: ${ props => props.fontSize ?? "1rem" };
  font-weight: 400;
  line-height: 1.5rem;
  padding: 0.25rem 0.5rem;
  margin: 0.5rem 0;
  outline: none;

  &:hover,
  &:focus {
    outline: none;
    border: 2px solid ${props => props.hoverColor || "#555"};
  }

  &:invalid {
    border: 2px solid red;
  }

  &::placeholder {
    color: #999;
  }
`
export default Input;
