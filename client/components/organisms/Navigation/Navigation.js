import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import Logout from '_assets/icons/log-out.svg';
import Logo from '_assets/icons/logo.svg';
import Settings from '_assets/icons/settings.svg';
import Trash from '_assets/icons/trash-2.svg';
import Moon from '_assets/icons/Moon.svg';
import Sun from '_assets/icons/Sun.svg';
import { attemptLogout } from '_thunks/auth';
import { attemptDeleteBoard, attemptUpdateBoard } from '_thunks/boards';
import UpdateTextButton from '_molecules/UpdateTextButton';

function Navigation({ pathname }) {
  const dispatch = useDispatch();
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);

  const { boards } = useSelector(R.pick(['boards']));
  const { categories } = useSelector(R.pick(['categories']));

  const boardId = pathname.split('/')[2];

  useEffect(() => {
    if (boards.length !== 0 && boardId) {
      const board = boards.find((b) => b.id === boardId);

      setCurrentBoard(board);
    }
  }, [boardId, boards]);

  useEffect(() => {
    currentBoard && setCurrentCategory(currentBoard.category);
  }, [currentBoard]);

  const logout = () => {
    dispatch(attemptLogout()).catch(R.identity);
  };

  const isHome = pathname === '/';

  const deleteBoard = () => dispatch(attemptDeleteBoard(boardId));

  const handleUpdateBoard = (attribute) => {
    dispatch(attemptUpdateBoard({ id: boardId, ...attribute }));
  };
  console.log(currentBoard && currentBoard);
  return (
    <StyledNavigation role="navigation" isHome={isHome}>
      <Left to="/">
        <Logo />
        Kanban 2.0
      </Left>

      <Right>
        {currentBoard && !isHome && (
          <>
            <UpdateTextButton
              text={currentBoard.title}
              handleUpdate={(newText) => handleUpdateBoard({ title: newText })}
            />

            <select
              value={currentCategory}
              onChange={(e) => {
                const newCat = e.target.value;

                if (currentCategory !== newCat) {
                  setCurrentCategory(newCat);
                  handleUpdateBoard({ category: newCat });
                }
              }}
            >
              <option value="">none</option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <Settings />
            {currentBoard.theme === 'light' ? (
              <Moon onClick={() => handleUpdateBoard({ theme: 'dark' })} />
            ) : (
              <Sun onClick={() => handleUpdateBoard({ theme: 'light' })} />
            )}
            <Trash onClick={() => boardId && deleteBoard()} />
          </>
        )}
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
  padding: ${({ theme }) => theme.sizes.spacing};

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

  & > *:not(:last-child) {
    margin-right: 6px;
  }

  svg {
    cursor: pointer;
  }
`;

Navigation.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export default Navigation;
