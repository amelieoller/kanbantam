import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { attemptAddList } from '_actions/lists';

function AddList({ boardId, lastListSortVal }) {
  const formRef = useRef();

  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const handleAddList = (e) => {
    e.preventDefault();

    if (title) {
      dispatch(attemptAddList({ title, board: boardId, order: lastListSortVal + 1 }));

      setTitle('');
    }
  };

  const updateTitle = (e) => setTitle(e.target.value);

  return (
    <NewListForm onSubmit={handleAddList} ref={formRef}>
      <NewListInput
        type="text"
        onChange={updateTitle}
        value={title}
        placeholder="Add new list..."
      />
    </NewListForm>
  );
}

AddList.propTypes = {
  boardId: PropTypes.string.isRequired,
  lastListSortVal: PropTypes.number.isRequired,
};

const NewListForm = styled.form`
  padding: 0 25px;
`;

const NewListInput = styled.input`
  width: 100%;
  font-size: 1.2rem;
  outline: none;
  border: 0;
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  padding: ${({ theme }) => theme.sizes.spacingInput};
  height: ${({ theme }) => theme.sizes.listHeaderHeight};
  border: 1px solid #ccc;
  color: ${({ theme }) => theme.colors.onSurface};
  height: 2.584rem;
`;

export default AddList;
