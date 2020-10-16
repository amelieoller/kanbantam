import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import DateSection from '../../organisms/CompletedTodos/DateSection';
import { todosByDateFromToday } from '_utils/filtering';

const TaskOverview = () => {
  const { categories } = useSelector(R.pick(['categories']));
  const { todos } = useSelector(R.pick(['todos']));

  return (
    <StyledTaskOverviewWrapper>
      <h1>Task Overview</h1>

      <StyledTaskOverview>
        <DateSection categories={categories} todosArr={todosByDateFromToday(todos, 0)} />
        <DateSection categories={categories} todosArr={todosByDateFromToday(todos, -1)} />
        <DateSection categories={categories} todosArr={todosByDateFromToday(todos, -2)} />
        <DateSection categories={categories} todosArr={todosByDateFromToday(todos, -3)} />
      </StyledTaskOverview>
    </StyledTaskOverviewWrapper>
  );
};

const StyledTaskOverviewWrapper = styled.div``;

const StyledTaskOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 250px);
  grid-gap: 30px;
`;

TaskOverview.propTypes = {};

export default TaskOverview;
