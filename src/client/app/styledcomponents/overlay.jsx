import styled from "styled-components"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${ props => props.theme.color.black };
  opacity: 0.7;
  z-index: 2;
`;

export default Overlay
