import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import DateSection from '_organisms/CompletedTodos/DateSection';
import { todosByDateFromToday } from '_utils/filtering';

const TaskOverview = () => {
  const { categories } = useSelector(R.pick(['categories']));
  const { todos } = useSelector(R.pick(['todos']));

  return (
    <StyledTaskOverviewWrapper>
      <h1>Task Overview</h1>

      <StyledTaskOverview>
        <DateSection
          categories={categories}
          todosArr={todosByDateFromToday(todos, 0)}
          showAllTodos
          expand
        />
        <DateSection
          categories={categories}
          todosArr={todosByDateFromToday(todos, -1)}
          showAllTodos
          expand
        />
        <DateSection
          categories={categories}
          todosArr={todosByDateFromToday(todos, -2)}
          showAllTodos
          expand
        />
        <DateSection
          categories={categories}
          todosArr={todosByDateFromToday(todos, -3)}
          showAllTodos
          expand
        />
      </StyledTaskOverview>
    </StyledTaskOverviewWrapper>
  );
};

const StyledTaskOverviewWrapper = styled.div`
  padding-left: 30px;
`;

const StyledTaskOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 250px);
  grid-gap: 30px;
`;

TaskOverview.propTypes = {};

export default TaskOverview;
