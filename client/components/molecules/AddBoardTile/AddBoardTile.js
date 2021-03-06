import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Button from '_atoms/Button';
import Input from '_atoms/Input';
import { attemptAddBoard } from '_actions/boards';
import useOnClickOutside from '_hooks/useOnClickOutside';

function AddBoardTile({ lastBoardSortVal }) {
  const formRef = useRef();

  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(formRef, () => setIsOpen(false));

  const handleAddBoardTile = (e) => {
    e.preventDefault();

    if (title) {
      dispatch(
        attemptAddBoard({
          title,
          order: lastBoardSortVal + 1,
        }),
      );
      setTitle('');
    }
  };

  const updateTitle = (e) => setTitle(e.target.value);

  const toggleIsOpen = () => setIsOpen((prevOpen) => !prevOpen);

  return isOpen ? (
    <NewBoardForm onSubmit={handleAddBoardTile} ref={formRef}>
      <Input onChange={updateTitle} value={title} label="New Board" noLabel autoFocus></Input>
      <Button onClick={handleAddBoardTile} label="Create new board">
        Create
      </Button>
    </NewBoardForm>
  ) : (
    <AddBoardTileButton onClick={toggleIsOpen}>Add a new board...</AddBoardTileButton>
  );
}

const NewBoardForm = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.sizes.spacing};
  background: ${({ theme }) => theme.colors.darker(1, 'surface')};

  input {
    margin-bottom: ${({ theme }) => theme.sizes.spacing};
  }
`;

const AddBoardTileButton = styled.button`
  border: 0;
  background: ${({ theme }) => theme.colors.darker(1, 'surface')};
  cursor: pointer;
  transition: background 0.1s;

  font-size: 15px;
  font-weight: 500;
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.one};
  padding: ${({ theme }) => theme.sizes.spacing};
  color: ${({ theme }) => theme.colors.onSurface};

  &:hover,
  &:focus {
    background: ${({ theme }) => theme.colors.surfaceVariant};
  }
`;

AddBoardTile.propTypes = {
  lastBoardSortVal: PropTypes.number.isRequired,
};

export default AddBoardTile;
