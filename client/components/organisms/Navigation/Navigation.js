import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Link } from 'react-router-dom';

import CategorySelect from '_molecules/CategorySelect';
import UpdateTextButton from '_molecules/UpdateTextButton';
import Settings from '_organisms/Settings';
import { attemptLogout } from '_thunks/auth';
import { attemptUpdateBoard } from '_actions/boards';
import Eye from '_assets/icons/eye.svg';
import EyeOff from '_assets/icons/eye-off.svg';
import Logo from '_assets/icons/logo.svg';
import Logout from '_assets/icons/log-out.svg';
import Moon from '_assets/icons/moon.svg';
import Sun from '_assets/icons/sun.svg';

function Navigation({ pathname }) {
  const dispatch = useDispatch();

  const [navBackground, setNavBackground] = useState('');

  const { currentBoard } = useSelector(R.pick(['currentBoard']));
  const { categories } = useSelector(R.pick(['categories']));

  const logout = () => dispatch(attemptLogout()).catch(R.identity);
  const isHome = pathname === '/';

  useEffect(() => {
    const defaultCat = currentBoard.category;

    if (!defaultCat) {
      setNavBackground('');
    } else if (categories.length !== 0) {
      const category = categories.find((cat) => cat.id === defaultCat);
      const color = category ? category.color : '';

      setNavBackground(color);
    }
  }, [categories, currentBoard]);

  const handleUpdateBoard = (attribute) => {
    dispatch(attemptUpdateBoard({ id: currentBoard.id, ...attribute }));
  };

  return (
    <StyledNavigation role="navigation" isHome={isHome} navBackground={navBackground}>
      <Left to="/">
        <Logo />
        Kanban 2.0
      </Left>

      <Right>
        {currentBoard.id && !isHome && (
          <>
            <UpdateTextButton
              text={currentBoard.title}
              handleUpdate={(newText) => handleUpdateBoard({ title: newText })}
            />

            <CategorySelect
              currentCategoryId={currentBoard.category}
              onChange={(newCategoryId) => handleUpdateBoard({ category: newCategoryId })}
            />

            {currentBoard.focusMode ? (
              <Eye
                onClick={() => handleUpdateBoard({ focusMode: false })}
                style={{ color: 'tomato' }}
              />
            ) : (
              <EyeOff onClick={() => handleUpdateBoard({ focusMode: true })} />
            )}

            <Settings currentBoard={currentBoard} />

            {currentBoard.theme === 'light' ? (
              <Moon onClick={() => handleUpdateBoard({ theme: 'dark' })} />
            ) : (
              <Sun onClick={() => handleUpdateBoard({ theme: 'light' })} />
            )}
          </>
        )}
        <Logout onClick={logout} />
      </Right>
    </StyledNavigation>
  );
}

const StyledNavigation = styled.nav`
  height: ${({ theme }) => theme.sizes.navbarHeight};
  background: ${({ theme, navBackground, isHome }) =>
    navBackground && !isHome ? navBackground : theme.colors.primary};
  transition: background 1.2s ease;
  color: ${({ theme }) => theme.colors.onPrimary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.sizes.spacing};
  z-index: 2;
  box-shadow: 0px 3px 6px 0px rgba(155, 170, 178, 0.25);

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
  display: flex;
  align-items: center;
  font-size: 1.4rem;

  & > *:not(:last-child):not(.cheeseburger-menu) {
    margin-right: 10px;
  }

  svg {
    cursor: pointer;
  }
`;

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Navigation;
