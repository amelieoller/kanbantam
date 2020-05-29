import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import * as R from 'ramda';
import { ThemeProvider } from 'styled-components';

import { light, dark } from '_styles/Theme';
import { attemptGetBoards } from '_thunks/boards';
import Board from '_templates/Board';

export default function BoardPage({ location }) {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));
  const { boards } = useSelector(R.pick(['boards']));

  const [loading, setLoading] = useState(true);
  const [currentBoard, setCurrentBoard] = useState(null);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    } else {
      dispatch(attemptGetBoards()).then(() => setLoading(false));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (!loading) {
      const boardId = location.pathname.split('/')[2];
      const board = boards.find((b) => b.id === boardId);

      if (board) {
        setCurrentBoard(board);
      } else {
        dispatch(push('/'));
      }
    }
  }, [location, loading, boards, dispatch]);

  return (
    !loading &&
    !!currentBoard && (
      <ThemeProvider theme={currentBoard.theme === 'light' ? light : dark}>
        <Board key={currentBoard.id} board={currentBoard} />
      </ThemeProvider>
    )
  );
}

BoardPage.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
};
