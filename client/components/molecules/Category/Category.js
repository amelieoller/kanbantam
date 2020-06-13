import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Input from '_atoms/Input';
import ColorDropdown from '_molecules/ColorDropdown/ColorDropdown';
import { attemptDeleteCategory, attemptUpdateCategory } from '_thunks/categories';
import Save from '_assets/icons/save.svg';
import Trash from '_assets/icons/trash-2.svg';

const Category = ({ category }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(category.title);
  const [color, setColor] = useState(category.color);
  const [hasBeenModified, setHasBeenModified] = useState(false);

  const deleteCategory = () => dispatch(attemptDeleteCategory(category.id));

  const handleUpdateCategory = () => {
    if (hasBeenModified) {
      dispatch(attemptUpdateCategory({ id: category.id, title: title, color: color }));
      setHasBeenModified(false);
    }
  };

  return (
    <StyledCategory key={category.id}>
      <Input
        label={`Edit ${title}`}
        handleOnBlur={(newTitle) => {
          setHasBeenModified(true);
          setTitle(newTitle);
        }}
        defaultValue={title}
      />
      <ColorDropdown
        onChange={(newColor) => {
          setHasBeenModified(true);
          setColor(newColor);
        }}
        currentColor={color}
      />
      <IconWrapper
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete the board "${title}"?`))
            deleteCategory();
        }}
        color="red"
      >
        <Trash />
      </IconWrapper>

      <IconWrapper
        onClick={handleUpdateCategory}
        color={hasBeenModified ? 'green' : 'grey'}
      >
        <Save />
      </IconWrapper>
    </StyledCategory>
  );
};

const StyledCategory = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
  position: relative;
`;

const IconWrapper = styled.button`
  background: ${({ color }) => color};
  border: none;
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  margin-left: ${({ theme }) => theme.sizes.spacingSmall};
  display: flex;
  align-items: center;

  svg {
    color: white;
  }
`;

Category.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
  }),
};

export default Category;
