import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Lost() {
  return (
    <StyledLost>
      <h1>404</h1>
      <p>The page you requested was not found.</p>
      <Link to="/">Go back home</Link>
    </StyledLost>
  );
}

const StyledLost = styled.div`
  text-align: center;
  margin-top: 25vh;

  h1 {
    font-size: 4em;
  }

  p {
    font-size: 1.5rem;
    font-style: italic;
    margin-bottom: 2rem;
  }

  a {
    font-size: 2.2rem;
  }
`;

export default Lost;
