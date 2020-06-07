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
  background-color: #f5f8fa;
  border: 1px solid #dfe4e7;
  padding-bottom: 0;
  border-bottom-right-radius: ${({ theme }) => theme.sizes.borderRadius};
  border-bottom-left-radius: ${({ theme }) => theme.sizes.borderRadius};
`;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: 100px;
  /* not relying on the items for a margin-bottom as it will collapse when the list is empty */
  margin: ${({ theme }) => theme.sizes.spacingSmall};
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${({ listHeight }) => listHeight}px;
`;

const List = ({ listId, todos, listHeight, placeholderProps }) => (
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
              {!!placeholderProps.clientY && dropSnapshot.isDraggingOver && (
                <Placeholder
                  style={{
                    top: placeholderProps.clientY,
                    left: placeholderProps.clientX,
                    height: placeholderProps.clientHeight,
                    width: placeholderProps.clientWidth,
                  }}
                />
              )}
            </DropZone>
          </>
        </ScrollContainer>
      </Wrapper>
    )}
  </Droppable>
);

const Placeholder = styled.div`
  position: absolute;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  border: 1px solid #d5dce0;
  background-image: linear-gradient(
    135deg,
    #eef2f5 25%,
    #f4f7f9 25%,
    #f4f7f9 50%,
    #eef2f5 50%,
    #eef2f5 75%,
    #f4f7f9 75%,
    #f4f7f9 100%
  );
  background-size: 28.28px 28.28px;
`;

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
      order: PropTypes.number.isRequired,
    }),
  ),
  listHeight: PropTypes.number.isRequired,
  placeholderProps: PropTypes.shape({
    clientHeight: PropTypes.number,
    clientWidth: PropTypes.number,
    clientX: PropTypes.number,
    clientY: PropTypes.number,
  }),
};

export default List;
