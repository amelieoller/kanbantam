import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import { attemptDeleteTodo } from '_actions/todos';
import XCircleIcon from '_assets/icons/x-circle.svg';
import RepeatIcon from '_assets/icons/repeat.svg';

const CompletedTodos = ({ todayCompletedTodos, yesterdayCompletedTodos }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector(R.pick(['categories']));

  const deleteTodo = (todoId) => {
    dispatch(attemptDeleteTodo(todoId));
  };

  const undoTodo = (todoId) => {
    console.log(todoId);
  };

  const renderListItem = (t) => {
    const category = categories.find((c) => c.id === t.category);

    return (
      <ListItem key={t.id} categoryColor={category && category.color}>
        <TodoText>{t.text}</TodoText>
        <Right>
          <RepeatIcon onClick={() => undoTodo(t.id)} />
          <XCircleIcon onClick={() => deleteTodo(t.id)} />
        </Right>
      </ListItem>
    );
  };

  return (
    <StyledLists>
      <DayWrapper>
        <h3>Today</h3>
        {todayCompletedTodos.map((t) => renderListItem(t))}
      </DayWrapper>

      <DayWrapper>
        <h3>Yesterday</h3>
        {yesterdayCompletedTodos.map((t) => renderListItem(t))}
      </DayWrapper>
    </StyledLists>
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

const StyledLists = styled.ul`
  color: ${({ theme }) => theme.colors.lighter(4, 'onSurface')};
  height: 240px;
`;

const DayWrapper = styled.div`
  margin-bottom: 10px;

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
  background: #e6e6e6;
  color: ${({ theme }) => theme.colors.onSurface};
  margin: 5px 0;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  border-left: 3px solid ${({ categoryColor }) => categoryColor};
`;

const TodoText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 4px;
`;

export default CompletedTodos;
