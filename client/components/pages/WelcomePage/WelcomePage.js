import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import Login from '_organisms/Login';
import backgroundImageLarge from '_assets/images/background-image-large.jpg';
import backgroundImageSmall from '_assets/images/background-image-small.jpg';
import GithubIcon from '_assets/icons/github.svg';

const WelcomePageStyles = styled.main`
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 35% auto;

  @media ${(props) => props.theme.media.tablet} {
    grid-template-columns: auto;
    grid-template-rows: 60% auto;
  }
`;

const LoginArea = styled.div`
  padding: 20vh 30px 40vh 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 450px;
  margin: auto;
  width: 100%;

  @media ${(props) => props.theme.media.tablet} {
    padding: 10px 30px;
    justify-content: flex-start;
  }
`;

const Header = styled.h1`
  font-family: 'Pacifico';
  color: ${(props) => props.theme.colors.primary};
  font-size: 30px;
`;

const GithubIconWrapper = styled.a`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10px 15px;
  font-size: 25px;

  svg {
    stroke: ${({ theme }) => theme.colors.onPrimary};
    transition: stroke 0.28s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover,
    &:focus {
      stroke: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const ImageArea = styled.div`
  background-image: url(${backgroundImageLarge});
  background-size: cover;
  background-position: 55% 100%;

  @media ${(props) => props.theme.media.tablet} {
    background-image: url(${backgroundImageSmall});
  }

  @media ${(props) => props.theme.media.tabletSmall} {
    background-position-y: initial;
  }
`;

const WelcomePage = () => {
  return (
    <WelcomePageStyles>
      <LoginArea>
        <Header>Kanban 2.0</Header>

        <Login />
      </LoginArea>

      <ImageArea>
        <GithubIconWrapper
          href="https://github.com/amelieoller/kanban-2.0"
          target="_blank"
          rel="noopener noreferrer"
          className="github-icon"
          label="GitHub Repository"
          aria-label="GitHub Repository"
        >
          <GithubIcon />
        </GithubIconWrapper>
      </ImageArea>
    </WelcomePageStyles>
  );
};

WelcomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(WelcomePage);
