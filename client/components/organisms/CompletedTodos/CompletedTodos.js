import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import { todosByDateFromToday } from '_utils/filtering';
import DateSection from './DateSection';

const CompletedTodos = () => {
  const { categories } = useSelector(R.pick(['categories']));
  const { todos } = useSelector(R.pick(['todos']));

  const [todayCompletedTodos] = todosByDateFromToday(todos, 0);
  const [yesterdayCompletedTodos] = todosByDateFromToday(todos, -1);

  return (
    <ListsWrapper>
      <StyledLists>
        <DateSection
          categories={categories}
          todosArr={[todayCompletedTodos, 'Today']}
          showAllTodos
        />
        <DateSection
          categories={categories}
          todosArr={[yesterdayCompletedTodos, 'Yesterday']}
          showAllTodos
        />

        <DateSection categories={categories} todosArr={todosByDateFromToday(todos, -2)} />
        <DateSection categories={categories} todosArr={todosByDateFromToday(todos, -3)} />
        <DateSection categories={categories} todosArr={todosByDateFromToday(todos, -4)} />
        <DateSection categories={categories} todosArr={todosByDateFromToday(todos, -5)} />

        {!todayCompletedTodos.length && !yesterdayCompletedTodos.length && (
          <GetStarted>Get started completing todos today!</GetStarted>
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
  board: PropTypes.shape({}),
};

const GetStarted = styled.div`
  font-family: 'Pacifico', cursive;
  text-align: center;
  padding-top: 7px;
  font-size: 14.5px;
`;

const ListsWrapper = styled.ul`
  padding: 8px 0 20px 0;
`;

const StyledLists = styled.ul`
  color: ${({ theme }) => theme.colors.lighter(4, 'onSurface')};
  /* max-height: 200px; */
  overflow: scroll;
`;

// const DayWrapper = styled.div`
//   padding-top: 15px;
//   h3 {
//     margin: 0;
//     margin-bottom: 5px;
//   }
// `;

export default CompletedTodos;
