import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import styled, { withTheme } from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { attemptGetLists } from '_thunks/lists';
import { attemptGetTodos } from '_thunks/todos';
import Sidebar from '_organisms/Sidebar';
import Column from '_organisms/Column';
import reorder, { reorderQuoteMap } from '_utils/dragAndDrop';
import useResize from '_hooks/useResize';

function Board({ id, theme: { sizes } }) {
  const boardRef = useRef(null);
  const boundingRect = useResize(boardRef);

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

  const calculateListHeight = () => {
    const screenHeight = boundingRect.screenHeight;
    const navHeight = sizes.navbarHeight.replace('px', '');
    const listHeaderHeight = sizes.listHeaderHeight.replace('px', '');
    const doublePadding = sizes.padding.replace('px', '') * 2;

    const listHeight = screenHeight - navHeight - listHeaderHeight - doublePadding;

    return listHeight;
  };

  return (
    !loading && (
      <StyledBoard isSidebarOpen={isSidebarOpen}>
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div ref={boardRef}>
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
                      listHeight={calculateListHeight()}
                    />
                  ))}
                  {provided.placeholder}
                </ListsWrapper>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </StyledBoard>
    )
  );
}

const StyledBoard = styled.div`
  display: grid;
  grid-auto-flow: column;
  height: calc(100vh - ${({ theme }) => theme.sizes.navbarHeight});

  /* "hack" for getting drag and drop scroll to work horizontally AND vertically */
  margin-top: ${({ theme }) => theme.sizes.navbarHeight};
  margin-left: ${({ theme, isSidebarOpen }) =>
    isSidebarOpen ? theme.sizes.sidebarWidthLarge : theme.sizes.sidebarWidthSmall};
  transition: 1s ease;
`;

const ListsWrapper = styled.div`
  display: grid;
  grid-auto-columns: 272px;
  grid-auto-flow: column;
  padding: ${({ theme }) => `${theme.sizes.padding} ${theme.sizes.paddingLarge}`};

  & > *:not(:last-child) {
    margin-right: 8px;
  }

  /* Don't use grid gap, it will add a choppy transition when lists are moved, instead margin has been added to each child */
  /* Don't use overflow-y scroll, react dnd can't do 2-direction scrolls yet, "hack" implemented by adding fixed positions to nav and sidebar */
`;

Board.propTypes = {
  id: PropTypes.string.isRequired,
  theme: PropTypes.shape({
    sizes: PropTypes.object,
  }),
};

export default withTheme(Board);
