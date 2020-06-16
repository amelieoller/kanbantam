import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import * as R from 'ramda';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

import AddBoardTile from '_molecules/AddBoardTile';
import BoardTile from '_molecules/BoardTile';
import { attemptUpdateBoard } from '_actions/boards';
import { sortItemsByOrder, calculateNewOrder } from '_utils/sorting';
import reorder from '_utils/dragAndDrop';

const SortableItem = SortableElement(({ board }) => <BoardTile key={board.id} board={board} />);

const SortableList = SortableContainer(({ boards }) => {
  return (
    <StyledBoardList>
      {boards.map((board, index) => (
        <SortableItem key={`item-${board.id}`} index={index} board={board} />
      ))}

      <AddBoardTile lastBoardSortVal={boards.length === 0 ? 0 : boards[boards.length - 1].order} />
    </StyledBoardList>
  );
});

const BoardList = () => {
  const { boards } = useSelector(R.pick(['boards']));
  const [allBoards, setAllBoards] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (boards.length !== 0) {
      const sortedBoards = sortItemsByOrder(boards);

      setAllBoards(sortedBoards);
    }
  }, [boards]);

  const onSortEnd = ({ oldIndex, newIndex }) => {
    // Dropped in same position
    if (oldIndex === newIndex) return;

    const newOrderedBoards = reorder(allBoards, oldIndex, newIndex);
    const newOrder = calculateNewOrder(newOrderedBoards, newIndex);
    const currentBoard = newOrderedBoards[newIndex];

    dispatch(attemptUpdateBoard({ id: currentBoard.id, order: newOrder }));

    setAllBoards(newOrderedBoards);
  };

  return (
    <SortableList
      boards={allBoards}
      onSortEnd={onSortEnd}
      axis="xy"
      pressDelay={100}
      helperClass="dragging-helper-class"
    />
  );
};

const StyledBoardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  margin: auto;
  overflow-y: auto;

  & > * {
    width: 270px;
    height: 140px;
    margin: 0 15px 15px 0;

    &:hover {
      background: ${({ theme }) => theme.colors.surfaceHover};
      box-shadow: ${({ theme }) => theme.shadows.two};
    }
  }
`;

export default BoardList;
