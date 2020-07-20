import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
  /* CSS Reset */
  ${reset}

  /* General */
  *, *:before, *:after {
    box-sizing: border-box;
  }

  *:focus {
    outline-color: ${({ theme }) => theme.colors.primary};
  }

  .react-codemirror2.code-mirror > div {
    width: 265px;
    background: white;
    padding: 3px;
    border: 1px solid ${({ theme }) => theme.colors.surfaceVariant};
    border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
    font-size: 1.2rem;
    height: 100%;

    @media ${(props) => props.theme.media.tabletSmall} {
      width: calc(100vw - 90px);
    }
  }

  html {
    background-color: #f5f5f5;
    font-size: 12px;
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  main {
    display: block;
  }

  hr {
    -webkit-box-sizing: content-box;
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }

  pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  a {
    background-color: transparent;
    text-decoration: none;
  }

  abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    -webkit-text-decoration: underline dotted;
    text-decoration: underline dotted;
  }

  b,
  strong {
    font-weight: bolder;
  }

  code,
  kbd,
  samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  small {
    font-size: 80%;
  }

  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  sub {
    bottom: -0.25em;
  }

  sup {
    top: -0.5em;
  }

  /* Headers */
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  h2 {
    font-size: 1.5em;
    margin: 0.83em 0;
  }

  h3 {
    font-size: 1.3em;
    margin: 1em 0;
  }

  h4 {
    font-size: 1em;
    margin: 1.33em 0;
  }

  h5 {
    font-size: 0.83em;
    margin: 1.67em 0;
  }

  h6 {
    font-size: 0.67em;
    margin: 1.33em 0;
  }

  /* Images */
  img {
    border-style: none;
  }

  svg {
    height: 22px;
  }

  /* Form Elements */
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }

  button,
  input {
    overflow: visible;
  }

  button,
  select {
    text-transform: none;
  }

  button,
  [type='button'],
  [type='reset'],
  [type='submit'] {
    -webkit-appearance: button;
  }

  button::-moz-focus-inner,
  [type='button']::-moz-focus-inner,
  [type='reset']::-moz-focus-inner,
  [type='submit']::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  button:-moz-focusring,
  [type='button']:-moz-focusring,
  [type='reset']:-moz-focusring,
  [type='submit']:-moz-focusring {
    outline: 1px dotted ButtonText;
  }
  
  fieldset {
    padding: 0.35em 0.75em 0.625em;
  }

  legend {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
  }

  progress {
    vertical-align: baseline;
  }

  textarea {
    overflow: auto;
  }

  [type='checkbox'],
  [type='radio'] {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
  }

  [type='number']::-webkit-inner-spin-button,
  [type='number']::-webkit-outer-spin-button {
    height: auto;
  }

  [type='search'] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }

  [type='search']::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }

  /* Miscellaneous */
  details {
    display: block;
  }

  summary {
    display: list-item;
  }

  template {
    display: none;
  }

  [hidden] {
    display: none;
  }
`;

export default GlobalStyles;
