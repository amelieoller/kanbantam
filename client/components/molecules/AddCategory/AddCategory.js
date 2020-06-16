import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import Button from '_atoms/Button';
import Input from '_atoms/Input';
import ColorDropdown from '_molecules/ColorDropdown';
import { attemptAddCategory } from '_actions/categories';

function AddCategory({ boardId }) {
  const dispatch = useDispatch();

  const initialCategory = { title: '', color: '#FF6900' };

  const [newCategory, setNewCategory] = useState(initialCategory);

  const handleAddCategory = () => {
    if (newCategory.title) {
      setNewCategory(initialCategory);

      dispatch(
        attemptAddCategory({
          ...newCategory,
          board: boardId,
        }),
      );
    }
  };

  const updateColor = (color) => {
    setNewCategory({ ...newCategory, color });
  };

  const handleOnBlur = (modelAttribute, value) => {
    setNewCategory({ ...newCategory, [modelAttribute]: value });
  };

  return (
    <Wrapper>
      <NewCategoryWrapper>
        <Input
          label="New Category"
          handleOnBlur={(value) => handleOnBlur('title', value)}
          defaultValue={newCategory.title}
        />

        <ColorDropdown onChange={updateColor} currentColor={newCategory.color} />
      </NewCategoryWrapper>

      <Button onClick={handleAddCategory}>
        <span>Create Category</span>
      </Button>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: ${({ theme }) => theme.sizes.spacingLarge} 0;
`;

const NewCategoryWrapper = styled.div`
  display: flex;
  position: relative;
  margin-bottom: ${({ theme }) => theme.sizes.spacing};
`;

AddCategory.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default AddCategory;
