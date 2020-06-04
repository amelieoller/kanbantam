import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import * as R from 'ramda';
import { ThemeProvider } from 'styled-components';

import { light, dark } from '_styles/Theme';
import { attemptGetBoards } from '_thunks/boards';
import { setBoard } from '_actions/currentBoard';
import Board from '_templates/Board';
import { attemptGetLists } from '_thunks/lists';
import { attemptGetTodos } from '_thunks/todos';
import { attemptGetCategories } from '_thunks/categories';

function BoardPage({ boardId }) {
  const dispatch = useDispatch();

  const { user } = useSelector(R.pick(['user']));
  const { boards } = useSelector(R.pick(['boards']));
  const { currentBoard } = useSelector(R.pick(['currentBoard']));

  const [loading, setLoading] = useState(true);

  // Get boards effect
  useEffect(() => {
    if (R.isEmpty(user)) {
      // If user is not logged in, send them to the login page
      dispatch(push('/login'));
    } else {
      if (boards.length === 0) {
        // If there are no boards yet, get boards
        dispatch(attemptGetBoards());
      }
    }
  }, [dispatch, user, boards]);

  // Get current board effect
  useEffect(() => {
    if (boards.length !== 0) {
      // When boards come in, find currentBoard
      const board = boards.find((b) => b.id === boardId);

      if (board) {
        // If board is found, set currentBoard in redux
        dispatch(setBoard(board));
      } else {
        // If board cannot be found, send user back to boards overview
        dispatch(push('/'));
      }
    }
  }, [boards, dispatch, boardId]);

  // Get lists and todos and set loading to false effect
  useEffect(() => {
    if (currentBoard.id) {
      // If there is a currentBoard, get lists and todos for that board
      Promise.all([
        dispatch(attemptGetLists(currentBoard.id)),
        dispatch(attemptGetTodos(currentBoard.id)),
        dispatch(attemptGetCategories(currentBoard.id)),
      ]).then(() => setLoading(false));
    }
  }, [currentBoard.id, dispatch]);

  return (
    !loading && (
      <ThemeProvider theme={currentBoard.theme === 'light' ? light : dark}>
        <Board key={currentBoard.id} board={currentBoard} />
      </ThemeProvider>
    )
  );
}

BoardPage.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default BoardPage;
