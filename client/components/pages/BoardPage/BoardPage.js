import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import * as R from 'ramda';

import { attemptGetBoards } from '_thunks/boards';
import Board from '_molecules/Board';

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
  }, []);

  useEffect(() => {
    if (!loading) {
      const boardId = location.pathname.split('/')[2];
      const board = boards.find((b) => b.id === boardId);

      if (board) {
        setCurrentBoard(board);
      } else {
        dispatch(push('/boards'));
      }
    }
  }, [location.pathname, loading]);

  return (
    !loading &&
    !!currentBoard && (
      <div className="board-page page">
        <Board key={currentBoard.id} {...currentBoard} />
      </div>
    )
  );
}
