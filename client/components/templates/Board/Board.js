import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { attemptGetLists } from '_thunks/lists';
import { attemptGetTodos } from '_thunks/todos';
import List from '_organisms/List';
import AddList from '_molecules/AddList';
import Sidebar from '_organisms/Sidebar';
import { handleDragEnd } from '_utils/dragAndDrop';
import QuoteApp from '_templates/QuoteApp';
import Column from '_organisms/Column';
import reorder, { reorderQuoteMap } from '_utils/dragAndDrop';

const Container = styled.div`
  display: inline-flex;
`;

function Board({ id }) {
  const dispatch = useDispatch();
  const { lists } = useSelector(R.pick(['lists']));
  const { todos } = useSelector(R.pick(['todos']));
  const { user } = useSelector(R.pick(['user']));

  const [columns, setColumns] = useState({});
  const [orderedLists, setOrderedLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const listsWithTodos = lists.reduce(
      (acc, curr) => ({
        ...acc,
        [curr.id]: todos.filter((todo) => todo.list === curr.id),
      }),
      {},
    );

    setColumns(listsWithTodos);
    setOrderedLists(Object.keys(listsWithTodos));
  }, [lists, todos]);

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

  const onDragEnd = (result) => {
    if (result.combine) {
      if (result.type === 'COLUMN') {
        const shallow = [...orderedLists];
        shallow.splice(result.source.index, 1);

        setOrderedLists(shallow);
        return;
      }

      const column = columns[result.source.droppableId];
      const withItemRemoved = [...column];
      withItemRemoved.splice(result.source.index, 1);

      setColumns({
        ...columns,
        [result.source.droppableId]: withItemRemoved,
      });
      return;
    }

    // dropped nowhere
    if (!result.destination) return;

    const source = result.source;
    const destination = result.destination;

    // did not move anywhere - can bail early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // reordering column
    if (result.type === 'COLUMN') {
      const newOrderedLists = reorder(orderedLists, source.index, destination.index);

      setOrderedLists(newOrderedLists);

      return;
    }

    const data = reorderQuoteMap({
      quoteMap: columns,
      source,
      destination,
    });

    setColumns(data.quoteMap);
  };

  return (
    !loading && (
      <StyledBoard isSidebarOpen={isSidebarOpen}>
        {/* {<QuoteApp incomingColumns={listsWithTodos} boardId={id} />} */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <ListsWrapper ref={provided.innerRef} {...provided.droppableProps}>
                {orderedLists.map((key, index) => (
                  <Column
                    key={key}
                    index={index}
                    title={key}
                    todos={columns[key]}
                    boardId={id}
                  />
                ))}
                {provided.placeholder}
              </ListsWrapper>
            )}
          </Droppable>
        </DragDropContext>
      </StyledBoard>
    )
  );
}

const StyledBoard = styled.div`
  display: grid;
  grid-auto-flow: column;
  height: calc(100vh - ${({ theme }) => theme.sizes.navbarHeight});

  /* "hack" for getting drag and drop scroll to work horizontally and vertically */
  margin-top: ${({ theme }) => theme.sizes.navbarHeight};
  margin-left: ${({ theme, isSidebarOpen }) =>
    isSidebarOpen ? theme.sizes.sidebarWidthLarge : theme.sizes.sidebarWidthSmall};
  transition: 1s ease;
`;

const ListsWrapper = styled.div`
  display: grid;
  grid-auto-columns: 272px;
  grid-auto-flow: column;
  grid-gap: 8px;
  /* overflow-y: scroll; */
  padding: ${({ theme }) => `${theme.sizes.padding} ${theme.sizes.paddingLarge}`};
`;

Board.propTypes = {
  id: PropTypes.string.isRequired,
};

export default Board;
