import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import { attemptDeleteTodo } from '_actions/todos';
import XCircleIcon from '_assets/icons/x-circle.svg';
import RepeatIcon from '_assets/icons/repeat.svg';
import { attemptUpdateTodo } from '_actions/todos';

const CompletedTodos = ({ todayCompletedTodos, yesterdayCompletedTodos, completedListId }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector(R.pick(['categories']));

  const deleteTodo = (todoId) => {
    dispatch(attemptDeleteTodo(todoId));
  };

  const undoTodo = (todo) => {
    // update the todo with this id
    // leave the list id, but also add a special list id (completed todos list)

    dispatch(
      attemptUpdateTodo({
        id: todo.id,
        completed_list_id: null,
        list: todo.completed_list_id,
        completed: false,
      }),
    );
  };

  const renderListItem = (t) => {
    const category = categories.find((c) => c.id === t.category);

    return (
      <ListItem key={t.id} categoryColor={category && category.color}>
        <TodoText>{t.text}</TodoText>
        <Right>
          <RepeatIcon onClick={() => undoTodo(t)} />
          <XCircleIcon
            onClick={() =>
              window.confirm(`Are you sure you want to delete this todo?`) && deleteTodo(t.id)
            }
          />
        </Right>
      </ListItem>
    );
  };

  return (
    <ListsWrapper>
      <StyledLists>
        {!!todayCompletedTodos.length && (
          <DayWrapper>
            <h3>Today</h3>
            {todayCompletedTodos.map((t) => renderListItem(t))}
          </DayWrapper>
        )}

        {!!yesterdayCompletedTodos.length && (
          <DayWrapper>
            <h3>Yesterday</h3>
            {yesterdayCompletedTodos.map((t) => renderListItem(t))}
          </DayWrapper>
        )}
      </StyledLists>
    </ListsWrapper>
  );
};

CompletedTodos.propTypes = {
  todayCompletedTodos: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, id: PropTypes.string }),
  ),
  yesterdayCompletedTodos: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, id: PropTypes.string }),
  ),
};

const ListsWrapper = styled.ul`
  padding: 8px 0 20px 0;
`;

const StyledLists = styled.ul`
  color: ${({ theme }) => theme.colors.lighter(4, 'onSurface')};
  max-height: 200px;
  overflow: scroll;
`;

const DayWrapper = styled.div`
  padding-top: 15px;
  h3 {
    margin: 0;
    margin-bottom: 5px;
  }
`;

const Right = styled.span`
  display: flex;
  width: 40px;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
  flex-shrink: 0;

  & > *:first-child {
    color: #a6a6a6;
  }

  & > *:last-child {
    color: ${({ theme }) => theme.colors.error};
  }

  svg {
    height: 14px;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1px;
  background: #f7f7f7;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 5px 0;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  border-left: 3px solid
    ${({ categoryColor, theme }) =>
      categoryColor ? categoryColor : theme.colors.lighter(5, 'onSurface')};
`;

const TodoText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 4px;
`;

export default CompletedTodos;
