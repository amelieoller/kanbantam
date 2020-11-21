import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

import Button from '_atoms/Button';
import AddTodo from '_molecules/AddTodo';
import List from '_organisms/List';
import { attemptDeleteList, attemptUpdateList } from '_actions/lists';
import TrashIcon from '_assets/icons/trash-2.svg';

const Column = ({
  id,
  title,
  todos,
  index,
  listHeight,
  board,
  placeholderProps,
  completedListId,
}) => {
  const dispatch = useDispatch();

  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteList = () => dispatch(attemptDeleteList(id));
  const updateTitle = (e) => setCurrentTitle(e.target.value);
  const editList = () => setIsEditOpen(true);

  const handleUpdateList = () => {
    if (currentTitle) {
      dispatch(attemptUpdateList({ id, title: currentTitle }));
    }

    setIsEditOpen(false);
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

                <Button
                  onClick={deleteList}
                  label={`Delete list ${currentTitle}`}
                  size="small"
                  color="#969696"
                  hoverColor="#eb134cb3"
                  noBackground
                >
                  <TrashIcon />
                </Button>
              </>
            )}
          </ListHeader>

          <List
            listId={id}
            todos={todos}
            board={board}
            listHeight={listHeight}
            placeholderProps={placeholderProps}
            completedListId={completedListId}
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
  padding: 2px;
  margin-bottom: 5px;
  transition: background-color ease 0.2s;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-right-radius: ${({ theme }) => theme.sizes.borderRadius};
  border-top-left-radius: ${({ theme }) => theme.sizes.borderRadius};
  background-color: ${({ theme }) => theme.colors.boardBackground};
  /* background-color: ${({ isDragging, theme }) =>
    isDragging
      ? theme.colors.darker(3, 'surfaceVariant')
      : theme.colors.lighter(1, 'surfaceVariant')}; */
  transition: color 0.2s ease;
  height: ${({ theme }) => theme.sizes.listHeaderHeight};
  color: ${({ theme }) => theme.colors.darkGrey};
  font-weight: 500;
  font-size: 14px;

  &:hover, &:active {
    color: ${({ theme }) => theme.colors.lightGrey};
  }

  &:focus {
    /* outline: 2px solid indigo;
    outline-offset: 2px; */
    outline: none;
  }
`;

const HeaderText = styled.div`
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
      completedAt: PropTypes.string,
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
  placeholderProps: PropTypes.shape({
    clientHeight: PropTypes.number,
    clientWidth: PropTypes.number,
    clientX: PropTypes.number,
    clientY: PropTypes.number,
  }),
  completedListId: PropTypes.string.isRequired,
};

export default Column;
