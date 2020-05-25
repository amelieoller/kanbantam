import React from 'react';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Logout from '_assets/icons/log-out.svg';
import Logo from '_assets/icons/logo.svg';
import { attemptLogout } from '_thunks/auth';

export default function Navigation() {
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(attemptLogout()).catch(R.identity);
  };

  return (
    <StyledNavigation role="navigation">
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
`;

const Left = styled(Link)`
  font-family: 'Pacifico', cursive;
  font-size: 22px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.onPrimary};

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
