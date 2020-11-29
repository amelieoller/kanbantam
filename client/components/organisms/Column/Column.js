import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';

import Button from '_atoms/Button';
import AddTodo from '_molecules/AddTodo';
import List from '_organisms/List';
import { attemptDeleteList, attemptUpdateList } from '_actions/lists';
import TrashIcon from '_assets/icons/trash-2.svg';
import useOnClickOutside from '_hooks/useOnClickOutside';
import MoreVerticalIcon from '_assets/icons/more-vertical.svg';
import EditIcon from '_assets/icons/edit.svg';

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
  const headerRef = useRef();

  const [currentTitle, setCurrentTitle] = useState(title);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useOnClickOutside(headerRef, () => setIsModalOpen(false));

  const deleteList = () => dispatch(attemptDeleteList(id));
  const updateTitle = (e) => setCurrentTitle(e.target.value);
  const editList = () => setIsEditOpen(true);

  const handleUpdateList = () => {
    if (currentTitle) {
      dispatch(attemptUpdateList({ id, title: currentTitle }));
    }

    setIsEditOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
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
            ref={headerRef}
          >
            {isEditOpen ? (
              <EditListInput type="text" value={currentTitle} onChange={updateTitle} autoFocus />
            ) : (
              <>
                <HeaderText>{currentTitle}</HeaderText>

                <Button
                  onClick={openModal}
                  label={`Delete list ${currentTitle}`}
                  size="small"
                  color="#CCCCD3"
                  hoverColor="#6200EE"
                  noBackground
                >
                  <MoreVerticalIcon />
                </Button>

                {isModalOpen && (
                  <HeaderModal>
                    <Button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${currentTitle}"?`))
                          deleteList();
                      }}
                      label={`Delete list ${currentTitle}`}
                      size="small"
                      color="#ffffff"
                      hoverColor="#eb134cb3"
                      noBackground
                    >
                      <TrashIcon />
                    </Button>

                    <Button
                      onClick={editList}
                      label={`Edit ${currentTitle}`}
                      size="small"
                      color="#ffffff"
                      hoverColor="#74d1aa"
                      noBackground
                    >
                      <EditIcon />
                    </Button>
                  </HeaderModal>
                )}
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

const HeaderModal = styled.div`
  position: absolute;
  background: #898992;
  right: 25px;
  top: 0;
  padding: 3px 5px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 6px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ListHeader = styled.div`
  padding: 0 20px 12px 20px;
  transition: background-color ease 0.2s;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-right-radius: ${({ theme }) => theme.sizes.borderRadius};
  border-top-left-radius: ${({ theme }) => theme.sizes.borderRadius};
  background-color: ${({ theme }) => theme.colors.boardBackground};
  transition: color 0.2s ease;
  /* height: ${({ theme }) => theme.sizes.listHeaderHeight}; */
  color: ${({ theme }) => theme.colors.darkGrey};
  font-weight: 500;
  font-size: 14px;

  &:hover,
  &:active {
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
  height: 15px;
  border: none;
  outline: none;
  text-transform: uppercase;
  font-size: 14px;
  padding: 0;
  color: #898992;
  font-weight: 500;
`;

const ListFooter = styled.div`
  height: ${({ theme }) => theme.sizes.listFooterHeight};
  padding-top: 7px;
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
