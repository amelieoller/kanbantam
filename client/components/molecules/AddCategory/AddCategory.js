import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { attemptAddCategory } from '_thunks/categories';

function AddCategory({ boardId }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();

    if (title) {
      dispatch(
        attemptAddCategory({
          title,
          board: boardId,
        }),
      );
      setTitle('');
    }
  };

  const updateTitle = (e) => setTitle(e.target.value);

  return (
    <form action="" onSubmit={handleAddCategory}>
      <input
        type="text"
        placeholder="New Category"
        onChange={updateTitle}
        value={title}
      />
    </form>
  );
}

AddCategory.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default AddCategory;
