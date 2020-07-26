import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import Button from '_atoms/Button';
import Input from '_atoms/Input';
import ColorDropdown from '_molecules/ColorDropdown';
import { attemptAddCategory } from '_actions/categories';
import useKeyPress from '_hooks/useKeyPress';

function AddCategory({ boardId }) {
  const dispatch = useDispatch();

  const startingColor = '#FF6900';

  const [title, setTitle] = useState('');
  const [color, setColor] = useState(startingColor);

  const handleAddCategory = () => {
    if (title) {
      dispatch(
        attemptAddCategory({
          title,
          color,
          board: boardId,
        }),
      );

      setTitle('');
      setColor(startingColor);
    }
  };

  useKeyPress('Enter', handleAddCategory);

  return (
    <Wrapper>
      <NewCategoryWrapper>
        <Input onChange={(e) => setTitle(e.target.value)} value={title} label="New Category" />

        <ColorDropdown onChange={(color) => setColor(color)} currentColor={color} />
      </NewCategoryWrapper>

      <Button onClick={handleAddCategory} label="Create category">
        Create Category
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
  align-items: flex-end;

  button {
    height: 31px;
  }
`;

AddCategory.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default AddCategory;
