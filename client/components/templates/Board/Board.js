import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import styled from 'styled-components';

import { attemptGetLists } from '_thunks/lists';
import { attemptGetTodos } from '_thunks/todos';
import List from '_organisms/List';
import AddList from '_molecules/AddList';
import Sidebar from '../../organisms/Sidebar';

function Board({ id }) {
  const dispatch = useDispatch();
  const { lists } = useSelector(R.pick(['lists']));
  const { user } = useSelector(R.pick(['user']));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (R.isEmpty(user)) {
      dispatch(push('/login'));
    } else {
      Promise.all([
        dispatch(attemptGetLists(id)),
        dispatch(attemptGetTodos(id)),
      ]).then(() => setLoading(false));
    }
  }, [id, dispatch, user]);

  return (
    !loading && (
      <StyledBoard>
        <Sidebar />

        <ListsWrapper>
          {lists.map((list) => (
            <List key={list.id} boardId={id} {...list} />
          ))}
          <AddList />
        </ListsWrapper>
      </StyledBoard>
    )
  );
}

const StyledBoard = styled.div`
  display: grid;
  grid-auto-flow: column;
  height: calc(100vh - ${({ theme }) => theme.sizes.navbarHeight});
`;

const ListsWrapper = styled.div`
  display: grid;
  grid-auto-columns: 272px;
  grid-auto-flow: column;
  grid-gap: 8px;
  overflow-y: scroll;
  padding: ${({ theme }) => `${theme.sizes.padding} ${theme.sizes.paddingLarge}`};
`;

Board.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Board;
