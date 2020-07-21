import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { attemptAddTodo } from '_actions/todos';
import useOnClickOutside from '_hooks/useOnClickOutside';
import PlusIcon from '_assets/icons/plus.svg';
import Button from '_atoms/Button';

function AddTodo({ board, listId, lastCardSortVal }) {
  const formRef = useRef();

  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(formRef, () => setIsOpen(false));

  const handleAddTodo = (e) => {
    e.preventDefault();

    if (text) {
      dispatch(
        attemptAddTodo({
          text,
          board: board.id,
          list: listId,
          order: lastCardSortVal + 1,
          minutes: board.defaultTime || 0,
          elapsedMinutes: 0,
          category: board.category
            ? board.category
            : board.defaultCategory
            ? board.defaultCategory
            : '',
          completed: false,
        }),
      );
      setText('');
    }
  };

  const updateText = (e) => setText(e.target.value);

  const toggleIsOpen = () => setIsOpen((prevOpen) => !prevOpen);

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
      <Button
        onClick={toggleIsOpen}
        label="Add todo to list"
        textColor="onSurface"
        size="large"
        noBackground
      >
        <PlusIcon />
      </Button>
    </ButtonWrapper>
  );
}

const NewTodoForm = styled.form`
  height: 100%;
`;

const NewTodoInput = styled.input`
  width: 100%;
  font-size: 1.2rem;
  height: 100%;
  outline: none;
  border: 0;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  padding: ${({ theme }) => theme.sizes.spacingInput};
`;

const ButtonWrapper = styled.div`
  button {
    width: 100%;
    padding: ${({ theme }) => theme.sizes.spacingSmall};
    justify-content: center;
  }
`;

AddTodo.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultTime: PropTypes.number,
    defaultCategory: PropTypes.string,
    category: PropTypes.string,
  }),
  listId: PropTypes.string.isRequired,
  lastCardSortVal: PropTypes.number.isRequired,
};

export default AddTodo;
