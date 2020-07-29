import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { Link } from 'react-router-dom';
import { darken } from 'polished';

import Button from '_atoms/Button';
import CategorySelect from '_molecules/CategorySelect';
import UpdateTextButton from '_molecules/UpdateTextButton';
import Settings from '_organisms/Settings';
import AccountSettings from '_organisms/AccountSettings';
import { attemptLogout } from '_thunks/auth';
import { attemptUpdateBoard } from '_actions/boards';
import EyeIcon from '_assets/icons/eye.svg';
import EyeOffIcon from '_assets/icons/eye-off.svg';
import LogoIcon from '_assets/icons/logo.svg';
import LogoutIcon from '_assets/icons/log-out.svg';
import MoonIcon from '_assets/icons/moon.svg';
import SunIcon from '_assets/icons/sun.svg';

function Navigation({ pathname }) {
  const dispatch = useDispatch();

  const [currentCategory, setCurrentCategory] = useState({});

  const { currentBoard } = useSelector(R.pick(['currentBoard']));
  const { categories } = useSelector(R.pick(['categories']));

  useEffect(() => {
    const defaultCat = currentBoard.category;

    if (!defaultCat) {
      setCurrentCategory({});
    } else if (categories.length !== 0) {
      const category = categories.find((cat) => cat.id === defaultCat);

      setCurrentCategory(category ? category : { color: '' });
    }
  }, [categories, currentBoard]);

  const handleUpdateBoard = (attribute) => {
    dispatch(attemptUpdateBoard({ id: currentBoard.id, ...attribute }));
  };

  const logout = () => dispatch(attemptLogout()).catch(R.identity);

  const isHome = pathname === '/';
  const isThinDisplay = window.innerWidth < 680;

  return (
    <StyledNavigation role="navigation" isHome={isHome} navBackground={currentCategory.color}>
      <Left to="/">
        <LogoIcon />
        {!isThinDisplay && 'Kanbantam'}
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
              <Button
                onClick={() => handleUpdateBoard({ focusMode: false })}
                label="Turn off focus mode"
                noBackground
                className="nav-active"
              >
                <EyeIcon />
              </Button>
            ) : (
              <Button
                onClick={() => handleUpdateBoard({ focusMode: true })}
                label="Turn on focus mode"
                noBackground
              >
                <EyeOffIcon />
              </Button>
            )}

            <Settings currentBoard={currentBoard} />

            {currentBoard.theme === 'light' ? (
              <Button
                onClick={() => handleUpdateBoard({ theme: 'dark' })}
                label="Turn on dark mode"
                noBackground
              >
                <MoonIcon />
              </Button>
            ) : (
              <Button
                onClick={() => handleUpdateBoard({ theme: 'light' })}
                label="Turn on light mode"
                noBackground
              >
                <SunIcon />
              </Button>
            )}
          </>
        )}

        {isHome && <AccountSettings />}
        <Button onClick={logout} label="Log out" noBackground>
          <LogoutIcon />
        </Button>
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
  z-index: 2;
  box-shadow: 0px 3px 6px 0px rgba(155, 170, 178, 0.25);

  & > * > button:hover,
  & > * > button:focus,
  & > a:hover,
  & > a:focus,
  .nav-active {
    background: ${({ navBackground, theme }) =>
      navBackground ? darken(0.1, navBackground) : darken(0.1, theme.colors.primary)};
    outline: none;
  }

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
  padding: 0 ${({ theme }) => theme.sizes.spacing};
  height: 100%;

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
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  /* position relative to make sure the category picker is in the right spot */
  position: relative;

  svg {
    height: 22px;
  }

  & > *:not(.cheeseburger-menu):not(.category-picker) {
    height: 100%;
    border-radius: 0;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }
`;

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Navigation;
