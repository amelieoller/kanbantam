import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Todo from '_molecules/Todo';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  background-color: rgb(235, 236, 240);
  padding-bottom: 0;
  border-bottom-right-radius: ${({ theme }) => theme.sizes.borderRadius};
  border-bottom-left-radius: ${({ theme }) => theme.sizes.borderRadius};
`;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: 100px;
  /* not relying on the items for a margin-bottom as it will collapse when the list is empty */
  margin: 5px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${({ listHeight }) => listHeight}px;
`;

const List = ({ listId, todos, listHeight }) => (
  <Droppable
    droppableId={listId}
    isCombineEnabled={false} // if set to true makes it possible to combine cards (it removes the item that was dragging)
  >
    {(dropProvided, dropSnapshot) => (
      <Wrapper
        isDraggingOver={dropSnapshot.isDraggingOver}
        isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
        {...dropProvided.droppableProps}
      >
        <ScrollContainer listHeight={listHeight}>
          <>
            <DropZone ref={dropProvided.innerRef}>
              {todos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id}
                  index={index}
                  shouldRespectForceTouch={false}
                >
                  {(dragProvided, dragSnapshot) => (
                    <Todo
                      key={todo.id}
                      todo={todo}
                      isDragging={dragSnapshot.isDragging}
                      provided={dragProvided}
                    />
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </DropZone>
          </>
        </ScrollContainer>
      </Wrapper>
    )}
  </Droppable>
);

List.propTypes = {
  listId: PropTypes.string.isRequired,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      board: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      list: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      sort: PropTypes.number.isRequired,
    }),
  ),
  listHeight: PropTypes.number.isRequired,
};

export default List;
