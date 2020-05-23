import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import * as R from 'ramda';

import { attemptGetBoard } from '_thunks/boards';
import Board from '_molecules/Board';

export default function BoardPage({ location }) {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));
  const { board } = useSelector(R.pick(['board']));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    } else {
      const boardId = location.pathname.split('/')[2];

      dispatch(attemptGetBoard(boardId)).then(() => setLoading(false));
    }
  }, []);

  return (
    !loading &&
    !!board && (
      <div className="board-page page">
        <Board key={board.id} {...board} />{' '}
      </div>
    )
  );
}
