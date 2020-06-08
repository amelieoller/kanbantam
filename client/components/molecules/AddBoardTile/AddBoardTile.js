import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { attemptAddBoard } from '_thunks/boards';
import useOnClickOutside from '_hooks/useOnClickOutside';

function AddBoardTile() {
  const formRef = useRef();

  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(formRef, () => setIsOpen(false));

  const handleAddBoardTile = (e) => {
    e.preventDefault();

    if (title) {
      dispatch(attemptAddBoard({ title }));
      setTitle('');
    }
  };

  const updateTitle = (e) => setTitle(e.target.value);

  const toggleIsOpen = () => setIsOpen((prevOpen) => !prevOpen);

  return isOpen ? (
    <NewBoardForm onSubmit={handleAddBoardTile} ref={formRef}>
      <NewBoardInput type="text" onChange={updateTitle} value={title} autoFocus />
      <NewBoardButton type="submit" value="Create" />
    </NewBoardForm>
  ) : (
    <AddBoardTileButton onClick={toggleIsOpen}>Add a new board...</AddBoardTileButton>
  );
}

const AddBoardTileButton = styled.button`
  border: 0;
  background: ${({ theme }) => theme.colors.surface};
  cursor: pointer;
  transition: background 0.1s;

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.surfaceVariant};
  }
`;

const NewBoardForm = styled.form`
  background: ${({ theme }) => theme.colors.surface};

  & > input {
    border-width: 0;
    border-radius: ${({ theme }) => theme.sizes.borderRadius};
    padding: ${({ theme }) => theme.sizes.inputPadding};
  }
`;

const NewBoardInput = styled.input`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.sizes.spacing};
`;

const NewBoardButton = styled.input`
  background: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  color: white;
`;

export default AddBoardTile;
