import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import * as R from 'ramda';
import ReactMarkdown from 'react-markdown';
import { parseISO } from 'date-fns';

import ProgressBar from '_molecules/ProgressBar';
import { attemptUpdateTodo } from '_actions/todos';
import { formatDaysToNow } from '_utils/dates.js';
import useCombinedRefs from '_hooks/useCombinedRefs';
import Calendar from '_assets/icons/calendar.svg';
import CheckCircle from '_assets/icons/check-circle.svg';
import Flag from '_assets/icons/flag.svg';
import { setCurrentTodo } from '_actions/currentTodo';

const fromNow = (date) => formatDaysToNow(parseISO(date));

const Todo = ({
  todo,
  isDragging,
  provided: { innerRef, draggableProps, dragHandleProps },
  isWithinPomodoro,
  selectedCategory,
  completedListId,
}) => {
  const dispatch = useDispatch();

  const cardRef = useRef(null);
  const combinedRef = useCombinedRefs(innerRef, cardRef);

  const { categories } = useSelector(R.pick(['categories']));

  const [todoCategory, setTodoCategory] = useState();

  useEffect(() => {
    if (categories) {
      const cat = categories.find((c) => c.id === todo.category);

      setTodoCategory(cat);
    }
  }, [categories, todo]);

  const handleClick = (e) => {
    const elAttribute = e.target.dataset.type;
    const elAttributeParent = e.target.parentElement.dataset.type;
    if (elAttribute === 'isClickable' || elAttributeParent === 'isClickable') return;
    if (e.target.tagName === 'A') return;

    const boundingRect = combinedRef.current.getBoundingClientRect();

    dispatch(setCurrentTodo({ ...todo, boundingRect }));
  };

  const handleBarUpdate = (newTotal) => {
    dispatch(attemptUpdateTodo({ id: todo.id, minutes: newTotal }));
  };

  const completeTodo = () => {
    dispatch(attemptUpdateTodo({ id: todo.id, list: completedListId, completed: true }));
  };

  return (
    <Container
      isDragging={isDragging}
      ref={combinedRef}
      {...draggableProps}
      {...dragHandleProps}
      onClick={handleClick}
      data-type="isCard"
      categoryColor={todoCategory && todoCategory.color}
      inPomodori={isWithinPomodoro}
      selectedCategory={selectedCategory}
    >
      <DoneButton onClick={completeTodo} data-type="isClickable" id="done-button">
        <CheckCircle data-type="isClickable" />
      </DoneButton>
      <Main>
        <ReactMarkdown source={todo.text} linkTarget="_blank" />
      </Main>

      {!!(!!todo.priority || !!todo.dueDate | !!todo.minutes) && (
        <Footer>
          <FooterLeft>
            {!!todo.priority && (
              <TopBadge
                color={
                  todo.priority === 1 ? 'mediumturquoise' : todo.priority === 2 ? 'orange' : 'coral'
                }
              >
                <Flag />
              </TopBadge>
            )}

            {!!todo.dueDate && (
              <TopBadge>
                <Calendar />
                <span>due {fromNow(todo.dueDate)}</span>
              </TopBadge>
            )}
          </FooterLeft>

          <FooterRight>
            {!!todo.minutes && (
              <ProgressBar
                total={todo.minutes}
                elapsed={todo.elapsedMinutes}
                type="min"
                handleBarUpdate={handleBarUpdate}
                increment={10}
              />
            )}
          </FooterRight>
        </Footer>
      )}
    </Container>
  );
};

const DoneButton = styled.button`
  position: absolute;
  top: 1px;
  right: 1px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  display: none;

  svg {
    width: 17px;
    height: 17px;
    color: ${({ theme }) => theme.colors.lighter(7, 'onSurface')};
  }
`;

const TopBadge = styled.span`
  background: ${({ color, theme }) => (color ? color : theme.colors.surfaceVariant)};
  border-radius: 7px;
  padding: 2px 5px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.onSurfaceVariant};
  margin-right: ${({ theme }) => theme.sizes.spacingSmall};

  &.pointer {
    cursor: pointer;
  }

  & > *:not(:last-child) {
    margin-right: 3px;
  }

  svg {
    width: 8px;
    height: 8px;
  }
`;

const Container = styled.div`
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  box-shadow: ${({ isDragging }) => (isDragging ? `2px 2px 1px lightgreen` : 'none')};
  padding: ${({ theme }) => theme.sizes.spacingSmall};
  min-height: ${({ theme }) => theme.sizes.minCardHeight};
  margin-bottom: ${({ theme }) => theme.sizes.spacingSmall};
  user-select: none;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.one};
  position: relative;
  border-right: ${({ theme, categoryColor, selectedCategory }) =>
    `${theme.sizes.cardBorder} solid ${selectedCategory ? 'transparent' : categoryColor}`};
  border-left: ${({ theme, inPomodori, selectedCategory, categoryColor }) =>
    `${theme.sizes.cardBorder} solid ${
      selectedCategory && inPomodori
        ? categoryColor
        : inPomodori
        ? theme.colors.primary
        : 'transparent'
    }`};
  color: ${({ theme }) => theme.colors.onSurface};

  ol {
    list-style: none;
    counter-reset: li;

    li {
      counter-increment: li;

      &::before {
        content: counter(li);
        color: ${({ theme }) => theme.colors.disabled('onSurface')};
        display: inline-block;
        width: 0.8em;
      }
    }
  }

  ul li::before {
    content: '•';
    color: ${({ theme }) => theme.colors.disabled('onSurface')};
    display: inline-block;
    width: 0.7em;
  }

  &:hover,
  &:active {
    box-shadow: ${({ theme }) => theme.shadows.three};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.two};
    background: ${({ theme }) => theme.colors.darker(1, 'surface')};
  }

  &:hover #done-button {
    display: block;
  }
`;

const Main = styled.div`
  font-size: 1.2rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: ${({ theme }) => theme.sizes.spacingSmall};

  & > *:not(:last-child) {
    margin-right: 10px;
  }
`;

const FooterLeft = styled.span`
  display: flex;
  align-items: center;
  width: 60%;
`;

const FooterRight = styled.span`
  display: flex;
  align-items: center;
  width: 40%;
`;

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    dueDate: PropTypes.string,
    priority: PropTypes.number,
    minutes: PropTypes.number,
    elapsedMinutes: PropTypes.number,
    category: PropTypes.string,
  }),
  isDragging: PropTypes.bool.isRequired,
  provided: PropTypes.shape({
    innerRef: PropTypes.func.isRequired,
    draggableProps: PropTypes.shape({}),
    dragHandleProps: PropTypes.shape({}),
  }),
  isWithinPomodoro: PropTypes.bool,
  selectedCategory: PropTypes.string,
  completedListId: PropTypes.string.isRequired,
};

Todo.defaultProps = {};

export default Todo;
