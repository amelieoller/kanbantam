import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';

import List from '_organisms/List';
import Trash from '_assets/icons/trash-2.svg';
import { attemptUpdateList, attemptDeleteList } from '_thunks/lists';
import AddTodo from '_molecules/AddTodo';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled.h4`
  padding: ${({ theme }) => theme.sizes.spacing};
  transition: background-color ease 0.2s;
  user-select: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-right-radius: ${({ theme }) => theme.sizes.borderRadius};
  border-top-left-radius: ${({ theme }) => theme.sizes.borderRadius};
  background-color: ${({ isDragging }) => (isDragging ? 'red' : 'gold')};
  transition: -color 0.2s ease;
  height: ${({ theme }) => theme.sizes.listHeaderHeight};
  text-transform: uppercase;

  &:hover {
    background: purple;
  }

  &:focus {
    outline: 2px solid indigo;
    outline-offset: 2px;
  }
`;

const DeleteButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;

  svg {
    color: lightgoldenrodyellow;
    width: 18px;
    height: 18px;
  }
`;

const Column = ({ id, title, todos, index, boardId, listHeight }) => {
  const dispatch = useDispatch();

  const deleteList = () => dispatch(attemptDeleteList(id));

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <ListHeader isDragging={snapshot.isDragging} {...provided.dragHandleProps}>
            {title}
            <DeleteButton onClick={deleteList}>
              <Trash />
            </DeleteButton>
          </ListHeader>
          <List
            listId={id}
            style={{
              backgroundColor: snapshot.isDragging ? 'blue' : null,
            }}
            todos={todos}
            boardId={boardId}
            listHeight={listHeight}
          />
          <ListFooter>
            <AddTodo boardId={boardId} listId={id} />
          </ListFooter>
        </Container>
      )}
    </Draggable>
  );
};

const ListFooter = styled.div`
  height: ${({ theme }) => theme.sizes.listFooterHeight};
  padding-top: ${({ theme }) => theme.sizes.spacingSmall};
`;

Column.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      board: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      list: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
  ),
  index: PropTypes.number.isRequired,
  boardId: PropTypes.string.isRequired,
  listHeight: PropTypes.number.isRequired,
};

export default Column;
