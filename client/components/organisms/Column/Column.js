import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'react-redux';

import List from '_organisms/List';
import Trash from '_assets/icons/trash-2.svg';
import { attemptDeleteList, attemptUpdateList } from '_thunks/lists';
import AddTodo from '_molecules/AddTodo';

const Column = ({ id, title, todos, index, listHeight, board }) => {
  const dispatch = useDispatch();

  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteList = () => dispatch(attemptDeleteList(id));
  const updateTitle = (e) => setCurrentTitle(e.target.value);
  const editList = () => setIsEditOpen(true);

  const handleUpdateList = () => {
    if (currentTitle) {
      dispatch(attemptUpdateList({ id, title: currentTitle })).then(() =>
        setIsEditOpen(false),
      );
    }
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Container ref={provided.innerRef} {...provided.draggableProps}>
          <ListHeader
            isDragging={snapshot.isDragging}
            {...provided.dragHandleProps}
            onDoubleClick={editList}
            onBlur={handleUpdateList}
            onKeyDown={(e) => e.keyCode === 13 && handleUpdateList()}
          >
            {isEditOpen ? (
              <EditListInput type="text" value={currentTitle} onChange={updateTitle} />
            ) : (
              <>
                <HeaderText>{currentTitle}</HeaderText>

                <DeleteButton onClick={deleteList}>
                  <Trash />
                </DeleteButton>
              </>
            )}
          </ListHeader>

          <List
            listId={id}
            style={{
              backgroundColor: snapshot.isDragging ? 'blue' : null,
            }}
            todos={todos}
            boardId={board.id}
            listHeight={listHeight}
          />
          <ListFooter>
            <AddTodo
              board={board}
              listId={id}
              lastCardSortVal={todos.length === 0 ? 0 : todos[todos.length - 1].order}
            />
          </ListFooter>
        </Container>
      )}
    </Draggable>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListHeader = styled.div`
  padding: ${({ theme }) => theme.sizes.spacing};
  transition: background-color ease 0.2s;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-right-radius: ${({ theme }) => theme.sizes.borderRadius};
  border-top-left-radius: ${({ theme }) => theme.sizes.borderRadius};
  background-color: ${({ isDragging }) => (isDragging ? 'red' : 'gold')};
  transition: -color 0.2s ease;
  height: ${({ theme }) => theme.sizes.listHeaderHeight};

  &:hover {
    background: purple;
  }

  &:focus {
    outline: 2px solid indigo;
    outline-offset: 2px;
  }
`;

const HeaderText = styled.div`
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

const EditListInput = styled.input`
  background: transparent;
  width: 100%;
  height: inherit;
  border: none;
  outline: none;
  text-transform: uppercase;
  font-size: 1rem;
  padding: 0;
`;

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
      order: PropTypes.number.isRequired,
    }),
  ),
  index: PropTypes.number.isRequired,
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  listHeight: PropTypes.number.isRequired,
};

export default Column;
