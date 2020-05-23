import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import * as R from 'ramda';

import { attemptGetLists } from '_thunks/lists';
import { attemptGetTodos } from '_thunks/todos';
import ListSection from '_templates/ListSection';

export default function ListPage({ boardId }) {
  const dispatch = useDispatch();
  const { user } = useSelector(R.pick(['user']));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    } else {
      dispatch(attemptGetLists(boardId)).then(() => setLoading(false));
      dispatch(attemptGetTodos(boardId)).then(() => setLoading(false));
    }
  }, []);

  return (
    !loading && (
      <div className="board-page page">
        <ListSection boardId={boardId} />
      </div>
    )
  );
}

ListPage.propTypes = {
  boardId: PropTypes.string.isRequired,
};
