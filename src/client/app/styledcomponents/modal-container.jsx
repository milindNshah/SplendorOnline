import styled from "styled-components";

const ModalContainer = styled.div`
  width: ${ props => `${props.width}rem`};
  max-height: 80vh;
  padding: ${ props => `${props.theme.modal.padding}rem`};
  background-color: ${ props => props.theme.color.white};
  overflow: scroll;
`;

export default ModalContainer
