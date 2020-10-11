import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import CompletedTodo from './CompletedTodo';

const CompletedTodos = ({ todayCompletedTodos, yesterdayCompletedTodos }) => {
  const { categories } = useSelector(R.pick(['categories']));

  return (
    <ListsWrapper>
      <StyledLists>
        {!!todayCompletedTodos.length && (
          <DayWrapper>
            <h3>Today</h3>
            {todayCompletedTodos.map((t) => (
              <CompletedTodo key={t.id} todo={t} categories={categories} />
            ))}
          </DayWrapper>
        )}

        {!!yesterdayCompletedTodos.length && (
          <DayWrapper>
            <h3>Yesterday</h3>
            {yesterdayCompletedTodos.map((t) => (
              <CompletedTodo key={t.id} todo={t} categories={categories} />
            ))}
          </DayWrapper>
        )}

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

export default CompletedTodos;
