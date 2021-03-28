import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { attemptAddTodo } from '_actions/todos';
import useOnClickOutside from '_hooks/useOnClickOutside';
import IconButton from '_atoms/IconButton';
import PlusIcon from '_assets/icons/plus.svg';

function AddTodo({ board, listId, lastCardSortVal }) {
  const formRef = useRef();

  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [todoMinutes, setTodoMinutes] = useState(0);

  useOnClickOutside(formRef, () => setIsOpen(false));

  const handleAddTodo = (e) => {
    e.preventDefault();

    if (text) {
      let todoCategory = '';

      if (board.category === 'all') {
        todoCategory = '';
      } else if (board.category) {
        todoCategory = board.category;
      } else if (board.defaultCategory) {
        todoCategory = board.defaultCategory;
      }

      dispatch(
        attemptAddTodo({
          text,
          board: board.id,
          list: listId,
          order: lastCardSortVal + 1,
          minutes: todoMinutes,
          elapsedMinutes: 0,
          category: todoCategory,
        }),
      );
      setText('');
    }
  };

  const updateText = (e) => setText(e.target.value);

  const toggleIsOpen = (minutes) => {
    setTodoMinutes(minutes);
    setIsOpen((prevOpen) => !prevOpen);
  };

  const renderDefaultTimeButton = (index) => {
    const time = board.defaultTimes ? board.defaultTimes[index] : 0;

    return (
      <IconButton onClick={() => toggleIsOpen(time)} altText="Add todo to list">
        {time === 0 ? <PlusIcon /> : <span>{time}</span>}
      </IconButton>
    );
  };

  return isOpen ? (
    <NewTodoForm onSubmit={handleAddTodo} ref={formRef}>
      <NewTodoInput
        type="text"
        onChange={updateText}
        value={text}
        placeholder="Add new list item..."
        autoFocus
      />
    </NewTodoForm>
  ) : (
    <ButtonWrapper>
      {renderDefaultTimeButton(0)}
      {renderDefaultTimeButton(1)}
      {renderDefaultTimeButton(2)}
    </ButtonWrapper>
  );
}

const NewTodoForm = styled.form`
  height: 100%;
  padding: 0 20px;
`;

const NewTodoInput = styled.input`
  width: 100%;
  font-size: 1.2rem;
  height: 100%;
  outline: none;
  border: 0;
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  padding: ${({ theme }) => theme.sizes.spacingInput};
  height: 2.584rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  max-width: 200px;
  margin: 0 auto;
`;

AddTodo.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultTimes: PropTypes.arrayOf(PropTypes.string),
    defaultCategory: PropTypes.string,
    category: PropTypes.string,
  }),
  listId: PropTypes.string.isRequired,
  lastCardSortVal: PropTypes.number.isRequired,
};

export default AddTodo;
