import { createGlobalStyle } from 'styled-components';

const ModalStyles = createGlobalStyle`
  .modal-underlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    opacity: 0;
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

  /* Codemirror */
  .react-codemirror2.code-mirror {
    @media ${({ sidebarWidth }) => `(max-width: ${sidebarWidth + 680}px)`} {
      margin-bottom: 8px;
    }
  }

  .react-codemirror2.code-mirror > div {
    width: 279px;
    background: white;
    padding: 3px;
    border: 1px solid ${({ theme }) => theme.colors.surfaceVariant};
    border-radius: ${({ theme }) => theme.sizes.borderRadius};
    font-size: 1.2rem;
    height: 100%;

    @media ${({ sidebarWidth }) => `(max-width: ${sidebarWidth + 680}px)`} {
      width: calc(100vw - ${({ sidebarWidth }) => `${40 + sidebarWidth}px`});
    }
  }

  .focus-wrapper .react-codemirror2.code-mirror > div {
    width: 100%;
  }
`;

export default ModalStyles;
