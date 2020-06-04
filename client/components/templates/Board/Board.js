import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { attemptUpdateTodo } from '_thunks/todos';
import { attemptUpdateList } from '_thunks/lists';
import reorder, { reorderQuoteMap } from '_utils/dragAndDrop';
import { calculateIndex, sortItemsByOrder } from '_utils/sorting';
import useResize from '_hooks/useResize';
import AddList from '_molecules/AddList';
import Sidebar from '_organisms/Sidebar';
import Column from '_organisms/Column';

function Board({ board, theme: { sizes } }) {
  const boardRef = useRef(null);
  const boundingRect = useResize(boardRef);

  const dispatch = useDispatch();

  const { lists } = useSelector(R.pick(['lists']));
  const { todos } = useSelector(R.pick(['todos']));

  const [listsWithTodos, setListsWithTodos] = useState({});
  const [orderedLists, setOrderedLists] = useState([]);

  useEffect(() => {
    const filteredListsWithoutSpecial = lists.filter((l) => !l.special);
    const sortedLists = sortItemsByOrder(filteredListsWithoutSpecial);

    // Category filter
    const filteredTodos =
      board.category === '' ? todos : todos.filter((t) => t.category === board.category);

    const todosByListId = sortedLists.reduce((acc, list) => {
      const todosFilteredByList = filteredTodos.filter((t) => t.list === list.id);
      const sortedAndFilteredTodos = sortItemsByOrder(todosFilteredByList);

      return {
        ...acc,
        [list.id]: sortedAndFilteredTodos,
      };
    }, {});

    setOrderedLists(sortedLists);
    setListsWithTodos(todosByListId);
  }, [lists, todos, board.category]);

  const onDragEnd = (result) => {
    if (result.combine) {
      if (result.type === 'COLUMN') {
        const shallow = [...orderedLists];
        shallow.splice(result.source.index, 1);

        setOrderedLists(shallow);
        return;
      }

      const column = listsWithTodos[result.source.droppableId];
      const withItemRemoved = [...column];
      withItemRemoved.splice(result.source.index, 1);

      const newListsWithTodos = {
        ...listsWithTodos,
        [result.source.droppableId]: withItemRemoved,
      };

      setListsWithTodos(newListsWithTodos);
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

      const prevList = newOrderedLists[destination.index - 1];
      const nextList = newOrderedLists[destination.index + 1];
      const currentList = newOrderedLists[destination.index];
      const newListSort = calculateIndex(prevList, nextList, newOrderedLists.length);

      dispatch(attemptUpdateList({ ...currentList, order: newListSort.base }));
      setOrderedLists(newOrderedLists);

      return;
    }

    const data = reorderQuoteMap({
      quoteMap: listsWithTodos,
      source,
      destination,
    });

    dispatch(attemptUpdateTodo(data.updatedTodo));

    setListsWithTodos(data.quoteMap);
  };

  const calculateListHeight = () => {
    const screenHeight = boundingRect.screenHeight;
    const navHeight = sizes.navbarHeight.replace('px', '');
    const listHeaderHeight = sizes.listHeaderHeight.replace('px', '');
    const listFooterHeight = sizes.listFooterHeight.replace('px', '');
    const doublePadding = sizes.spacing.replace('px', '') * 2;

    const listHeight =
      screenHeight - navHeight - listHeaderHeight - listFooterHeight - doublePadding;

    return listHeight;
  };

  return (
    <StyledBoard isSidebarOpen={board.sidebarOpen}>
      <Sidebar isSidebarOpen={board.sidebarOpen} currentBoard={board} />

      <div ref={boardRef}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <ListsWrapper ref={provided.innerRef} {...provided.droppableProps}>
                {orderedLists.map((list, index) => (
                  <Column
                    key={list.id}
                    index={index}
                    title={list.title}
                    id={list.id}
                    todos={listsWithTodos[list.id]}
                    board={board}
                    listHeight={calculateListHeight()}
                  />
                ))}
                {provided.placeholder}

                <div>
                  <AddList
                    boardId={board.id}
                    lastListSortVal={
                      orderedLists.length === 0
                        ? 0
                        : orderedLists[orderedLists.length - 1].order
                    }
                  />
                </div>
              </ListsWrapper>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </StyledBoard>
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
  grid-auto-columns: ${({ theme }) => theme.sizes.listWidth};
  grid-auto-flow: column;
  padding: ${({ theme }) => `${theme.sizes.spacing} ${theme.sizes.spacingLarge}`};

  & > *:not(:last-child) {
    margin-right: 8px;
  }

  /* Don't use grid gap, it will add a choppy transition when lists are moved, instead margin has been added to each child */
  /* Don't use overflow-y scroll, react dnd can't do 2-direction scrolls yet, "hack" implemented by adding fixed positions to nav and sidebar */
`;

Board.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sidebarOpen: PropTypes.bool.isRequired,
    category: PropTypes.string,
  }),
  theme: PropTypes.shape({
    sizes: PropTypes.object,
  }),
};

export default withTheme(Board);
