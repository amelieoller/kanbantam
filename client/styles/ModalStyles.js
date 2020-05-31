import * as styled from 'styled-components';

const ModalStyles = styled.createGlobalStyle`
  .modal-underlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
    z-index: 3;
  }

  .ReactModal__Overlay--after-open {
    opacity: 1;
    transition: opacity 0.15s;
  }

  .ReactModal__Overlay--before-close {
    opacity: 0;
  }

  .modal {
    position: absolute;
    display: flex;
    align-items: flex-start;
    height: 0;
    outline: 0;
  }
`;

export default ModalStyles;
