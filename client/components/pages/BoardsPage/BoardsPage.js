import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import * as R from 'ramda';

import { attemptGetBoards } from '_thunks/boards';
import BoardSection from '_templates/BoardSection';

export default function BoardsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    } else {
      dispatch(attemptGetBoards()).then(() => setLoading(false));
    }
  }, []);

  return (
    !loading && (
      <div className="board-page page">
        <BoardSection />
      </div>
    )
  );
}
