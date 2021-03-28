import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import * as R from 'ramda';

import Checkmark from '_atoms/Checkmark';
import ProgressBar from '_molecules/ProgressBar';
import MarkdownArea from '_molecules/MarkdownArea';
import { attemptUpdateTodo } from '_actions/todos';
import useCombinedRefs from '_hooks/useCombinedRefs';
import { setCurrentTodo } from '_actions/currentTodo';

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

  const handleTodoTextUpdate = (newText) => {
    dispatch(attemptUpdateTodo({ id: todo.id, text: newText }));
  };

  const handleMinuteUpdate = (newTotal) => {
    dispatch(attemptUpdateTodo({ id: todo.id, minutes: newTotal }));
  };

  const completeTodo = () => {
    dispatch(
      attemptUpdateTodo({
        id: todo.id,
        list: completedListId,
        completedListId: todo.list,
        completedAt: Date.now(),
      }),
    );
  };

  const handleClick = (e) => {
    const { tagName, dataset, parentElement } = e.target;

    // If an item (with the id of 'isClickable') is clicked, don't open modal
    if (dataset.type === 'isClickable' || parentElement.dataset.type === 'isClickable') return;
    // If link is clicked don't open modal
    if (tagName === 'A' || tagName === 'INPUT') return;

    const boundingRect = combinedRef.current.getBoundingClientRect();

    dispatch(setCurrentTodo({ ...todo, boundingRect }));
  };

  return (
    <Container
      isDragging={isDragging}
      ref={combinedRef}
      {...draggableProps}
      {...dragHandleProps}
      data-type="isCard"
      id={todo.id}
      categoryColor={todoCategory && todoCategory.color}
      inPomodori={isWithinPomodoro}
      selectedCategory={selectedCategory === 'all' ? '' : selectedCategory}
      onClick={handleClick}
      important={todo.important}
    >
      <MarkdownArea text={todo.text} handleUpdateText={handleTodoTextUpdate} />

      <Footer minutes={todo.minutes}>
        <FooterLeft>
          {/* {!!todo.important && (
              <TopBadge color="coral">
                <AlertCircleIcon />
              </TopBadge>
            )}

            {!!todo.dueDate && (
              <TopBadge>
                <CalendarIcon />
                <span>due {fromNow(todo.dueDate)}</span>
              </TopBadge>
            )} */}

          {!!todo.minutes && (
            <ProgressBar
              total={todo.minutes}
              elapsed={todo.elapsedMinutes}
              handleUpdate={handleMinuteUpdate}
              incrementBy={10}
              incrementLabel={`Add 10 minutes to ${todo.text.substring(0, 20)}`}
              showMinus={false}
            />
          )}
        </FooterLeft>

        <FooterRight>
          <Checkmark onClick={completeTodo} highlight={!!isWithinPomodoro} />
        </FooterRight>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  border: ${({ important }) => `1px solid ${important ? '#F4A09A' : '#ccc'}`};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  box-shadow: ${({ isDragging }) => (isDragging ? `2px 2px 1px lightgreen` : 'none')};
  padding: 11px 6px;
  min-height: ${({ theme }) => theme.sizes.minCardHeight};
  user-select: none;
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.shadows.one};
  position: relative;
  border-right: ${({ theme, categoryColor, selectedCategory }) =>
    `${theme.sizes.cardBorder} solid ${selectedCategory ? 'inherit' : categoryColor}`};
  margin-bottom: 7px;

  &:hover,
  &:active,
  &:focus {
    box-shadow: ${({ theme }) => theme.shadows.two};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme, minutes }) => (minutes ? theme.sizes.spacing : theme.sizes.spacingSmall)};

  & > *:not(:last-child) {
    margin-right: 16px;
  }
`;

const FooterLeft = styled.span`
  display: flex;
  align-items: center;
  width: 100%;
`;

const FooterRight = styled.span`
  display: flex;
  align-items: center;
`;

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    completedAt: PropTypes.string,
    dueDate: PropTypes.string,
    important: PropTypes.boolean,
    minutes: PropTypes.number,
    elapsedMinutes: PropTypes.number,
    category: PropTypes.string,
    list: PropTypes.string,
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
