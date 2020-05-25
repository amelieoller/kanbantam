import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Logout from '_assets/icons/log-out.svg';
import Logo from '_assets/icons/logo.svg';
import { attemptLogout } from '_thunks/auth';

function Navigation({ pathname }) {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(attemptLogout()).catch(R.identity);
  };

  const isHome = pathname === '/';

  return (
    <StyledNavigation role="navigation" isHome={isHome}>
      <Left to="/">
        <Logo />
        Kanban 2.0
      </Left>

      <Right>
        <Logout onClick={logout} />
      </Right>
    </StyledNavigation>
  );
}

const StyledNavigation = styled.nav`
  height: ${({ theme }) => theme.sizes.navbarHeight};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.sizes.padding};

  /* "hack" for getting drag and drop scroll to work horizontally AND vertically */
  position: ${({ isHome }) => (isHome ? 'relative' : 'fixed')};
  width: 100%;
  top: 0;
`;

const Left = styled(Link)`
  font-family: 'Pacifico', cursive;
  font-size: 22px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.onPrimary};
  white-space: nowrap;

  svg {
    margin-right: 5px;

    #triangle {
      fill: ${({ theme }) => theme.colors.onPrimary};
    }

    #cards {
      fill: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Right = styled.div`
  svg {
    cursor: pointer;
  }
`;

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Navigation;
