import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Todo from '_molecules/Todo';
import { formatYearMonthDay } from '_utils/dates';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.lighter(1, 'surfaceVariant')};
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

const List = ({ listId, todos, listHeight, placeholderProps, board, completedListId }) => {
  const [withinPomodoroTodos, setWithinPomodoroTodos] = useState([]);

  useEffect(() => {
    if (todos.length === 0) return;

    const today = new Date();
    const formattedDate = formatYearMonthDay(today);

    const withinPomodoroTime = () => {
      // If there are no totalPomodori return
      if (!board.totalPomodori) return;
      const elapsedPomodoriToday = board.elapsedPomodori[formattedDate] || 0;
      const pomodoriLeft = board.totalPomodori - elapsedPomodoriToday;

      if (!pomodoriLeft) return;

      let accumulatedMinutes = 0;
      let minutesAvailable = 25 * pomodoriLeft;
      const selectedTodos = [];

      // For each todo iterate and figure out if it fits within our available minutes, if so, add to array, otherwise ignore
      for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        const todoMinutesLeft = todo.minutes - todo.elapsedMinutes;
        const newAccMinutes = accumulatedMinutes + todoMinutesLeft;

        // Otherwise, if todo has minutes AND todo fits into minutesAvailable, push id to selectedTodos and increment accumulatedMinutes
        if (todoMinutesLeft && newAccMinutes <= minutesAvailable) {
          accumulatedMinutes = newAccMinutes;
          selectedTodos.push(todo.id);
        }
      }

      return selectedTodos;
    };

    const withinPomodoro = withinPomodoroTime();

    setWithinPomodoroTodos(withinPomodoro);
  }, [todos, board.totalPomodori, board.elapsedPomodori]);

  return (
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
                        isWithinPomodoro={
                          withinPomodoroTodos && withinPomodoroTodos.includes(todo.id)
                        }
                        selectedCategory={board.category}
                        completedListId={completedListId}
                      />
                    )}
                  </Draggable>
                ))}
                {dropProvided.placeholder}
                {/* {!!placeholderProps.clientY && dropSnapshot.isDraggingOver && (
                  <Placeholder
                    style={{
                      top: placeholderProps.clientY,
                      left: placeholderProps.clientX,
                      height: placeholderProps.clientHeight,
                      width: placeholderProps.clientWidth,
                    }}
                  />
                )} */}
              </DropZone>
            </>
          </ScrollContainer>
        </Wrapper>
      )}
    </Droppable>
  );
};

const Placeholder = styled.div`
  position: absolute;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  border: 1px solid ${({ theme }) => theme.colors.surfaceVariant};
  background-image: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.lighter(25, 'surfaceVariant')} 25%,
    ${({ theme }) => theme.colors.lighter(15, 'surfaceVariant')} 25%,
    ${({ theme }) => theme.colors.lighter(15, 'surfaceVariant')} 50%,
    ${({ theme }) => theme.colors.lighter(25, 'surfaceVariant')} 50%,
    ${({ theme }) => theme.colors.lighter(25, 'surfaceVariant')} 75%,
    ${({ theme }) => theme.colors.lighter(15, 'surfaceVariant')} 75%,
    ${({ theme }) => theme.colors.lighter(15, 'surfaceVariant')} 100%
  );
  background-size: 28.28px 28.28px;
`;

List.propTypes = {
  listId: PropTypes.string.isRequired,
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      board: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      id: PropTypes.string.isRequired,
      list: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
      minutes: PropTypes.number,
      elapsedMinutes: PropTypes.number,
    }),
  ),
  board: PropTypes.shape({
    totalPomodori: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    elapsedPomodori: PropTypes.objectOf(PropTypes.number),
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

export default List;
