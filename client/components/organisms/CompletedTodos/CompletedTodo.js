import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { attemptDeleteTodo } from '_actions/todos';
import XCircleIcon from '_assets/icons/x-circle.svg';
import MoreIcon from '_assets/icons/more-vertical.svg';
import ChevronsDown from '_assets/icons/chevrons-down.svg';
import ChevronsUp from '_assets/icons/chevrons-up.svg';
import RepeatIcon from '_assets/icons/repeat.svg';
import { attemptUpdateTodo } from '_actions/todos';
import useOnClickOutside from '_hooks/useOnClickOutside';

const CompletedTodo = ({ todo, categories, expand }) => {
  const popoverRef = useRef();

  const dispatch = useDispatch();
  const category = categories.find((c) => c.id === todo.category);

  const [showPopover, setShowPopover] = useState(false);
  const [isOpen, setIsOpen] = useState(expand);

  useOnClickOutside(popoverRef, (e) => {
    if (![...e.target.classList].includes(`noClick-${todo.id}`)) setShowPopover(false);
  });

  const deleteTodo = (todoId) => {
    dispatch(attemptDeleteTodo(todoId));
  };

  const undoTodo = () => {
    // update the todo with this id
    // leave the list id, but also add a special list id (completed todos list)

    dispatch(
      attemptUpdateTodo({
        id: todo.id,
        completedListId: null,
        list: todo.completedListId,
        completedAt: '',
      }),
    );
  };

  const handleTodoClick = () => {
    dispatch(
      attemptUpdateTodo({
        id: todo.id,
        highlighted: !todo.highlighted,
      }),
    );
  };

  const renderPopover = () => {
    return (
      <StyledPopover ref={popoverRef}>
        <RepeatIcon onClick={() => undoTodo(todo)} />
        <XCircleIcon
          onClick={() =>
            window.confirm(`Are you sure you want to delete this todo?`) && deleteTodo(todo.id)
          }
        />
      </StyledPopover>
    );
  };

  return (
    <ListItem
      key={todo.id}
      categoryColor={category && category.color}
      highlighted={todo.highlighted}
      isOpen={isOpen}
    >
      <div
        className="todo-text"
        onClick={() => handleTodoClick(todo)}
        onKeyPress={() => handleTodoClick(todo)}
      >
        {todo.text}
      </div>

      <span className={`right-section noClick-${todo.id}`}>
        <span>{todo.minutes}</span>
        {isOpen ? (
          <ChevronsUp onClick={() => setIsOpen(false)} />
        ) : (
          <ChevronsDown onClick={() => setIsOpen(true)} />
        )}
        <MoreIcon
          className={`noClick-${todo.id}`}
          onClick={() => setShowPopover((prevVal) => !prevVal)}
        />
      </span>

      {showPopover && renderPopover()}
    </ListItem>
  );
};

CompletedTodo.propTypes = {
  todo: PropTypes.shape({
    highlighted: PropTypes.bool,
    text: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    completedListId: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    minutes: PropTypes.number,
  }),
  categories: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired })),
  expand: PropTypes.bool,
};

CompletedTodo.defaultProps = {
  expand: false,
};

const StyledPopover = styled.div`
  position: absolute;
  right: 0px;
  background: ${({ theme }) => theme.colors.lighter(7, 'onSurface')};
  border-radius: 3px;
  padding: 4px;
  top: -32px;
  color: ${({ theme }) => theme.colors.lighter(1, 'onSurface')};

  svg {
    height: 20px;
  }
`;

const ListItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1px;
  background: ${({ theme, highlighted }) =>
    highlighted ? theme.colors.lighter(6, 'onSurface') : theme.colors.lighter(87, 'onSurface')};
  color: ${({ theme, highlighted }) =>
    highlighted ? theme.colors.onPrimary : theme.colors.onSurface};
  margin: 5px 0;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  border-left: 3px solid
    ${({ categoryColor, theme }) =>
      categoryColor ? categoryColor : theme.colors.lighter(5, 'onSurface')};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.lighter(6, 'onSurface')};
  }

  .todo-text {
    overflow: hidden;
    white-space: ${({ isOpen }) => (isOpen ? 'normal' : 'nowrap')};
    text-overflow: ellipsis;
    padding: 4px;
    transition: all 0.2s ease;
  }

  .right-section {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 41px;

    svg {
      height: 14px;
    }
  }
`;

export default CompletedTodo;
