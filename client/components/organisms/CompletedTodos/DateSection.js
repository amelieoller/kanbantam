import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CompletedTodo from './CompletedTodo';
import ChevronsDown from '_assets/icons/chevrons-down.svg';
import ChevronsUp from '_assets/icons/chevrons-up.svg';

const DateSection = ({ categories, todosArr, showAllTodos, expand }) => {
  const [incomingTodos, dayText] = todosArr;
  const [showAll, setShowAll] = useState(showAllTodos);
  const [todos, setTodos] = useState(incomingTodos);
  const highlightedTodos = todos.filter((t) => t.highlighted);

  useEffect(() => {
    if (showAll) {
      setTodos(incomingTodos);
    } else {
      setTodos(highlightedTodos);
    }
  }, [showAll, incomingTodos]);

  if (!incomingTodos.length) return null;

  return (
    <DayWrapper>
      <h3>
        <span>{dayText}</span>
        {incomingTodos.length > highlightedTodos.length &&
          (showAll ? (
            <ChevronsUp onClick={() => setShowAll(false)} />
          ) : (
            <ChevronsDown onClick={() => setShowAll(true)} />
          ))}
      </h3>
      {todos.map((t) => (
        <CompletedTodo key={t.id} todo={t} categories={categories} expand={expand} />
      ))}
    </DayWrapper>
  );
};

const DayWrapper = styled.div`
  padding-top: 15px;

  h3 {
    margin: 0;
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;

    svg {
      height: 17px;
    }
  }
`;

DateSection.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({})),
  todosArr: PropTypes.array,
  showAllTodos: PropTypes.bool,
  expand: PropTypes.string,
};

DateSection.defaultProps = { showAllTodos: false };

export default DateSection;
