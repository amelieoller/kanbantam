import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import backgroundImageLarge from '_assets/images/background-image-large.jpg';
import backgroundImageSmall from '_assets/images/background-image-small.jpg';
import Github from '_assets/icons/github.svg';
import Login from '_assets/icons/log-in.svg';
import User from '_assets/icons/user.svg';
import LoginSection from '_templates/LoginSection';
import RegisterSection from '_templates/RegisterSection';

const WelcomePageStyles = styled.div`
  height: 100vh;
  width: 100%;
  display: grid;
  grid-template-columns: 35% auto;

  @media ${(props) => props.theme.media.tablet} {
    grid-template-columns: auto;
    grid-template-rows: 50% auto;
  }
`;

const LoginArea = styled.div`
  padding: 20vh 30px 40vh 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media ${(props) => props.theme.media.tablet} {
    padding: 50px 30px;
    justify-content: flex-start;
  }
`;

const Header = styled.h1`
  font-family: 'Pacifico';
  color: ${(props) => props.theme.colors.primary};
  font-size: 30px;
`;

const Buttons = styled.div`
  @media ${(props) => props.theme.media.tablet} {
    display: flex;
    flex-wrap: wrap;
  }
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.sizes.spacingInput};
  border-width: 0;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.onSurface};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.button};
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  margin-right: ${({ theme }) => theme.sizes.spacing};
  margin-top: ${({ theme }) => theme.sizes.spacing};
  font-size: 1rem;

  svg {
    margin-right: ${({ theme }) => theme.sizes.spacing};
  }

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.buttonActive};
  }
`;

const GithubIcon = styled.a`
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
  const [isLogin, setIsLogin] = useState(true);

  return (
    <WelcomePageStyles>
      <LoginArea>
        <Header>Kanban 2.0</Header>

        {isLogin ? (
          <LoginSection setIsLogin={setIsLogin} />
        ) : (
          <RegisterSection setIsLogin={setIsLogin} />
        )}
      </LoginArea>

      <ImageArea>
        <GithubIcon
          href="https://github.com/amelieoller/kanban-2.0"
          target="_blank"
          rel="noopener noreferrer"
          className="github-icon"
        >
          <Github />
        </GithubIcon>
      </ImageArea>
    </WelcomePageStyles>
  );
};

WelcomePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(WelcomePage);
