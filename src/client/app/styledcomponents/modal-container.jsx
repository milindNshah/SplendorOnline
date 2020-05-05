import styled from "styled-components";

const ModalContainer = styled.div`
  width: ${ props => `${props.width + (2 * props.theme.modal.padding)}rem`};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${ props => `${props.theme.modal.padding}rem`};
  background-color: ${ props => props.theme.color.white};
`;

export default ModalContainer
