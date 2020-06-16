import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { push } from 'connected-react-router';

import Spinner from '_atoms/Spinner';
import BoardSection from '_templates/BoardSection';
import { attemptGetBoards } from '_actions/boards';

function BoardsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    } else {
      dispatch(attemptGetBoards()).then(() => setLoading(false));
    }
  }, [dispatch, user]);

  return !loading ? <BoardSection /> : <Spinner />;
}

export default BoardsPage;
