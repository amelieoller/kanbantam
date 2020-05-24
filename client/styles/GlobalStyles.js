import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`	
  ${reset}

	*, *:before, *:after {
		box-sizing: border-box;
	}


	html {
		background-color: #f5f5f5;
		font-size: 12px;
	}

	body {
		margin: 0;
		padding: 0;
		font-family: 'Roboto', sans-serif;
		line-height: 1;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	img {
		height: 100%;
		width: 100%;
		max-height: 100%;
    max-width: 100%;
  }

	svg {
		height: 22px;
	}

	a {
		text-decoration: none;
	}
`;

export default GlobalStyles;
