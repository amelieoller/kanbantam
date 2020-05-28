import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { attemptAddList } from '_thunks/lists';
import useOnClickOutside from '_hooks/useOnClickOutside';

function AddList({ boardId, lastListSortVal }) {
  const formRef = useRef();

  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(formRef, () => setIsOpen(false));

  const handleAddList = (e) => {
    e.preventDefault();

    if (title) {
      dispatch(attemptAddList({ title, board: boardId, sort: lastListSortVal + 1 }));

      setTitle('');
    }
  };

  const updateTitle = (e) => setTitle(e.target.value);

  const toggleIsOpen = () => setIsOpen((prevOpen) => !prevOpen);

  return isOpen ? (
    <NewListForm onSubmit={handleAddList} ref={formRef}>
      <NewListInput
        type="text"
        onChange={updateTitle}
        value={title}
        placeholder="New list..."
        autoFocus
      />
    </NewListForm>
  ) : (
    <Button onClick={toggleIsOpen}>Add a new list...</Button>
  );
}

AddList.propTypes = {
  boardId: PropTypes.string.isRequired,
  lastListSortVal: PropTypes.number.isRequired,
};

const NewListForm = styled.form``;

const NewListInput = styled.input`
  width: 100%;
  font-size: 1.2rem;
  outline: none;
  border: 0;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
  padding: ${({ theme }) => theme.sizes.spacingInput};
  text-transform: uppercase;
`;

const Button = styled.button`
  border: none;
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  width: 100%;
  padding: ${({ theme }) => theme.sizes.spacingInput};
  text-align: left;
  font-size: 1.2rem;
  border-radius: ${({ theme }) => theme.sizes.borderRadiusSmall};
`;

export default AddList;
