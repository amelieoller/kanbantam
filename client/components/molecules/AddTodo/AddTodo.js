import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { attemptAddTodo } from '_thunks/todos';
import useOnClickOutside from '_hooks/useOnClickOutside';
import Plus from '_assets/icons/plus.svg';

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
          category: board.defaultCategory || '',
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
    <Button onClick={toggleIsOpen}>
      <Plus />
    </Button>
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

const Button = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
  padding: ${({ theme }) => theme.sizes.spacingSmall};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  :hover {
    svg {
      color: coral;
    }
  }
`;

AddTodo.propTypes = {
  board: PropTypes.shape({
    id: PropTypes.string.isRequired,
    defaultTime: PropTypes.number,
    defaultCategory: PropTypes.string,
  }),
  listId: PropTypes.string.isRequired,
  lastCardSortVal: PropTypes.number.isRequired,
};

export default AddTodo;
