import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Column from '_organisms/Column';
import TodoModal from '_organisms/TodoModal';
import { attemptUpdateList } from '_actions/lists';
import { attemptUpdateTodo } from '_actions/todos';
import reorder, { reorderTodoList } from '_utils/dragAndDrop';
import { calculateNewOrder } from '_utils/sorting';
import { filterByCategory } from '_utils/filtering';
import useResize from '_hooks/useResize';
import SidebarWrapper from '_organisms/SidebarWrapper';

function PageTest({ board, theme: { sizes } }) {
  const boardRef = useRef(null);
  const boundingRect = useResize(boardRef);

  const dispatch = useDispatch();

  const { lists } = useSelector(R.pick(['lists']));
  const { todos } = useSelector(R.pick(['todos']));

  const [listsWithTodos, setListsWithTodos] = useState({});
  const [orderedLists, setOrderedLists] = useState([]);
  const [placeholderProps, setPlaceholderProps] = useState({});

  const filterByDateRange = (ts, startDate, endDate) =>
    ts.filter((t) => {
      const splitDate = t.completedAt.split('-');
      const year = splitDate[0];
      const month = parseInt(splitDate[1]) - 1;
      const day = splitDate[2].split('T')[0];
      const date = new Date(year, month, day);

      return date >= startDate && date < endDate;
    });

  useEffect(() => {
    const dayLists = [];
    let newTodos = filterByCategory(board.category, todos);

    const todosByListId = Array.from({ length: 10 }).reduce((acc, list, index) => {
      const startDate = new Date(new Date().setDate(new Date().getDate() - index));
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(new Date().setDate(new Date().getDate() - (index - 1)));
      endDate.setHours(0, 0, 0, 0);

      const myList = {
        board: board.id,
        order: index,
        id: index,
        listDate: startDate,
        title: startDate.getDate(),
      };
      dayLists.push(myList);

      const filteredTodos = filterByDateRange(newTodos, startDate, endDate);

      return {
        ...acc,
        [myList.id]: filteredTodos,
      };
    }, {});

    setOrderedLists(dayLists);
    setListsWithTodos(todosByListId);
  }, [lists, todos, board.category]);

  const calculateCardPlaceholderPosition = (arr, draggedDOM, sourceIndex, parentList) => {
    const { offsetHeight, offsetWidth } = draggedDOM;
    const cardsStart = calculateCardsStart();
    const cardMargin = 5;

    var clientY =
      cardMargin +
      cardsStart +
      arr.slice(0, sourceIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);

        return total + curr.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight: offsetHeight,
      clientWidth: offsetWidth,
      clientY,
      clientX: parentList
        ? parentList.getBoundingClientRect().left
        : draggedDOM.parentNode.getBoundingClientRect().left,
    });
  };

  const getDraggedDomEl = (draggableId) =>
    document.querySelector(`[data-rbd-drag-handle-draggable-id='${draggableId}']`);

  const getDraggedDomParent = (parentId) =>
    document.querySelector(`[data-rbd-droppable-id='${parentId}']`).firstElementChild
      .firstElementChild;

  const onDragStart = (result) => {
    if (result.type === 'COLUMN') return;

    const draggedDOM = getDraggedDomEl(result.draggableId);

    if (!draggedDOM) return;

    const sourceIndex = result.source.index;

    calculateCardPlaceholderPosition([...draggedDOM.parentNode.children], draggedDOM, sourceIndex);
  };

  const onDragUpdate = (result) => {
    if (!result.destination || result.type === 'COLUMN') return;
    const destinationList = result.destination.droppableId;

    const draggedDOM = getDraggedDomEl(result.draggableId);

    if (!draggedDOM) return;

    const parentList = getDraggedDomParent(destinationList);
    const childrenArray = [...parentList.children];
    const destinationIndex = result.destination.index;
    const sourceIndex = result.source.index;

    let updatedArray;

    if (result.source.droppableId === result.destination.droppableId) {
      // If moved in same list
      const movedItem = childrenArray[sourceIndex];
      childrenArray.splice(sourceIndex, 1);

      updatedArray = [
        ...childrenArray.slice(0, destinationIndex),
        movedItem,
        ...childrenArray.slice(destinationIndex + 1),
      ];
    } else {
      // If moved to different list
      updatedArray = [
        ...childrenArray.slice(0, destinationIndex),
        draggedDOM,
        ...childrenArray.slice(destinationIndex),
      ];
    }

    calculateCardPlaceholderPosition(updatedArray, draggedDOM, destinationIndex, parentList);
  };

  const onDragEnd = (result) => {
    setPlaceholderProps({});

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
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // reordering column
    if (result.type === 'COLUMN') {
      const newOrderedLists = reorder(orderedLists, source.index, destination.index);
      const currentList = newOrderedLists[destination.index];

      const newOrder = calculateNewOrder(newOrderedLists, destination.index);

      dispatch(attemptUpdateList({ ...currentList, order: newOrder }));
      setOrderedLists(newOrderedLists);

      return;
    }

    const data = reorderTodoList({
      quoteMap: listsWithTodos,
      source,
      destination,
    });

    dispatch(attemptUpdateTodo(data.updatedTodo));

    setListsWithTodos(data.quoteMap);
  };

  const calculateCardsStart = () => {
    const navHeight = parseFloat(sizes.navbarHeight);
    const listHeaderHeight = parseFloat(sizes.listHeaderHeight);
    const padding = parseFloat(sizes.spacing);

    return navHeight + listHeaderHeight + padding;
  };

  const calculateListHeight = () => {
    const screenHeight = boundingRect.screenHeight;
    const navHeight = parseFloat(sizes.navbarHeight);
    const listHeaderHeight = parseFloat(sizes.listHeaderHeight);
    const listFooterHeight = parseFloat(sizes.listFooterHeight);
    const doublePadding = parseFloat(sizes.spacingExtraLarge) * 2;

    return screenHeight - navHeight - listHeaderHeight - listFooterHeight - doublePadding;
  };

  return (
    <StyledBoard isSidebarOpen={board.sidebarOpen}>
      <SidebarWrapper isSidebarOpen={board.sidebarOpen} boardId={board.id}>
        Some sidebar content
      </SidebarWrapper>

      <main id="main" ref={boardRef}>
        {/* <TaskOverview /> */}
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={onDragStart}
          onDragUpdate={onDragUpdate}
        >
          <Droppable droppableId="board" type="COLUMN" direction="horizontal">
            {(provided) => (
              <ListsWrapper
                ref={provided.innerRef}
                {...provided.droppableProps}
                isSidebarOpen={board.sidebarOpen}
              >
                {orderedLists.map((list, index) => (
                  <Column
                    key={list.id}
                    index={index}
                    title={list.title}
                    id={list.id}
                    todos={listsWithTodos[list.id]}
                    board={board}
                    listHeight={calculateListHeight()}
                    placeholderProps={placeholderProps}
                  />
                ))}
                {provided.placeholder}
              </ListsWrapper>
            )}
          </Droppable>
        </DragDropContext>
      </main>

      <TodoModal isSidebarOpen={board.sidebarOpen} boardId={board.id} />
    </StyledBoard>
  );
}

const StyledBoard = styled.div`
  display: grid;
  grid-auto-flow: column;
  height: calc(100vh - ${({ theme }) => theme.sizes.navbarHeight});
  background: ${({ theme }) => theme.colors.boardBackground};
  width: max-content;
  max-width: 100vw;
  max-height: 100vh;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  /* "hack" for getting drag and drop scroll to work horizontally AND vertically */
  margin-top: ${({ theme }) => theme.sizes.navbarHeight};
  transition: 0.4s ease;
`;

const ListsWrapper = styled.div`
  display: grid;
  grid-auto-columns: ${({ theme }) => theme.sizes.listWidth};
  grid-auto-flow: column;
  padding: ${({ theme }) => theme.sizes.spacingExtraLarge};
  margin-left: ${({ theme, isSidebarOpen }) =>
    isSidebarOpen ? theme.sizes.sidebarWidthLarge : theme.sizes.sidebarWidthSmall};
  transition: 0.4s ease;
  height: 100%;

  & > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.sizes.spacingSmall};
    border-right: 1px solid #ccc;
    height: 100%;
    padding-right: ${({ theme }) => theme.sizes.spacingSmall};
  }

  /* Don't use grid gap, it will add a choppy transition when lists are moved, instead margin has been added to each child */
  /* Don't use overflow-y scroll, react dnd can't do 2-direction scrolls yet, "hack" implemented by adding fixed positions to nav and sidebar */
`;

PageTest.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sidebarOpen: PropTypes.bool.isRequired,
    category: PropTypes.string,
    focusMode: PropTypes.bool.isRequired,
    defaultFocusList: PropTypes.string,
  }),
  theme: PropTypes.shape({
    sizes: PropTypes.object,
  }),
};

export default withTheme(PageTest);
