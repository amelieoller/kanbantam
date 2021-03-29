import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { push } from 'connected-react-router';

import Spinner from '_atoms/Spinner';
import { attemptGetCategories } from '_actions/categories';
import { attemptGetLists } from '_actions/lists';
import { attemptGetBoards } from '_actions/boards';
import { attemptGetTodos } from '_actions/todos';
import { setCurrentBoard } from '_actions/currentBoard';
import { light, dark } from '_styles/Theme';
import ModalStyles from '_styles/ModalStyles';
import PageTest from './PageTest';

function CompletedPage({ boardId }) {
  const dispatch = useDispatch();

  const { user } = useSelector(R.pick(['user']));
  const { boards } = useSelector(R.pick(['boards']));
  const { currentBoard } = useSelector(R.pick(['currentBoard']));

  const [loading, setLoading] = useState(true);
  const [fetchBoardsCompleted, setFetchBoardsCompleted] = useState(false);

  // Get boards effect
  useEffect(() => {
    if (R.isEmpty(user)) {
      // If user is not logged in, send them to the login page
      dispatch(push('/login'));
    } else {
      if (boards.length === 0) {
        // If there are no boards yet, get boards
        dispatch(attemptGetBoards()).then(() => setFetchBoardsCompleted(true));
      } else {
        setFetchBoardsCompleted(true);
      }
    }
  }, [dispatch, user]);

  // Get current board effect
  useEffect(() => {
    if (fetchBoardsCompleted) {
      // When boards come in, find currentBoard
      const board = boards.find((b) => b.id === boardId);

      if (board) {
        // If board is found, set currentBoard in redux
        dispatch(setCurrentBoard(board));
      } else {
        // If board cannot be found, send user back to boards overview
        dispatch(push('/'));
      }
    }
  }, [fetchBoardsCompleted, boards]);

  // Get lists and todos and set loading to false effect
  useEffect(() => {
    if (currentBoard.id && currentBoard.id === boardId) {
      // If there is a currentBoard, get lists and todos for that board
      Promise.all([
        dispatch(attemptGetLists(currentBoard.id)),
        dispatch(attemptGetTodos(currentBoard.id, true)),
        dispatch(attemptGetCategories(currentBoard.id)),
      ]).then(() => setLoading(false));
    }
  }, [currentBoard.id, dispatch, boardId]);

  return !loading ? (
    <ThemeProvider theme={currentBoard.theme === 'light' ? light : dark}>
      <ModalStyles sidebarWidth={currentBoard.sidebarOpen ? 250 : 50} />

      <PageTest key={currentBoard.id} board={currentBoard} />
    </ThemeProvider>
  ) : (
    <Spinner />
  );
}

CompletedPage.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default CompletedPage;
