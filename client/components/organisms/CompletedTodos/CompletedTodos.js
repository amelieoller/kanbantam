import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';

import { attemptDeleteTodo } from '_actions/todos';
import XIcon from '_assets/icons/x.svg';

const CompletedTodos = ({ todayCompletedTodos }) => {
  const dispatch = useDispatch();

  const { categories } = useSelector(R.pick(['categories']));

  const deleteTodo = (todoId) => {
    dispatch(attemptDeleteTodo(todoId));
  };

  return (
    <StyledList>
      {todayCompletedTodos.map((t) => {
        const category = categories.find((c) => c.id === t.category);
        return (
          <ListItem key={t.id}>
            <TodoText categoryColor={category && category.color}>{t.text}</TodoText>
            <Right>
              <XIcon onClick={() => deleteTodo(t.id)} />
            </Right>
          </ListItem>
        );
      })}
    </StyledList>
  );
};

CompletedTodos.propTypes = {
  todayCompletedTodos: PropTypes.arrayOf(
    PropTypes.shape({ text: PropTypes.string, id: PropTypes.string }),
  ),
};

const StyledList = styled.ul`
  padding-top: 1rem;
  color: ${({ theme }) => theme.colors.lighter(4, 'onSurface')};
`;

const Right = styled.span`
  width: 14px;

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
  align-items: start;
  justify-content: space-between;
  padding-bottom: 1px;
`;

const TodoText = styled.span`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border-left: 2px solid ${({ categoryColor }) => categoryColor};
  padding: 0 3px;
`;

export default CompletedTodos;
