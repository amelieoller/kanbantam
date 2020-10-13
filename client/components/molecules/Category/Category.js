import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import Input from '_atoms/Input';
import ColorDropdown from '_molecules/ColorDropdown/ColorDropdown';
import { attemptDeleteCategory, attemptUpdateCategory } from '_actions/categories';
import SaveIcon from '_assets/icons/save.svg';
import TrashIcon from '_assets/icons/trash-2.svg';

const Category = ({ category }) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(category.title);
  const [color, setColor] = useState(category.color);
  const [hasBeenModified, setHasBeenModified] = useState(false);

  useEffect(() => {
    if (category.title === title && category.color === color) {
      setHasBeenModified(false);
    } else if (!hasBeenModified) {
      setHasBeenModified(true);
    }
  }, [category.title, category.color, color, title]);

  const deleteCategory = () => dispatch(attemptDeleteCategory(category.id));

  const saveCategory = () => {
    if (hasBeenModified) {
      dispatch(attemptUpdateCategory({ id: category.id, title: title, color: color }));
      setHasBeenModified(false);
    }
  };

  const handleTitleChange = ({ target: { value } }) => setTitle(value);
  const handleColorChange = (newColor) => setColor(newColor);

  return (
    <StyledCategory key={category.id}>
      <Input noLabel label={`Edit ${title}`} onChange={handleTitleChange} defaultValue={title} />
      <ColorDropdown onChange={handleColorChange} currentColor={color} />
      <IconWrapper
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete the board "${title}"?`))
            deleteCategory();
        }}
        isDelete={true}
        label={`Delete ${title}`}
        aria-label={`Delete ${title}`}
      >
        <TrashIcon />
      </IconWrapper>

      <IconWrapper
        onClick={saveCategory}
        hasBeenModified={hasBeenModified}
        disabled={!hasBeenModified}
        label={`Save ${title}`}
        aria-label={`Save ${title}`}
      >
        <SaveIcon />
      </IconWrapper>
    </StyledCategory>
  );
};

const StyledCategory = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  position: relative;

  svg {
    height: 18px;
  }

  button {
    padding: 0 6px;
  }
`;

const IconWrapper = styled.button`
  background: transparent;
  border: 1px solid
    ${({ hasBeenModified, theme }) =>
      hasBeenModified ? theme.colors.success : theme.colors.surfaceVariant};
  border-radius: ${({ theme }) => theme.sizes.borderRadius};
  margin-left: ${({ theme }) => theme.sizes.spacingSmall};
  display: flex;
  align-items: center;
  color: ${({ hasBeenModified, theme }) =>
    hasBeenModified ? theme.colors.success : theme.colors.surfaceVariant};
  cursor: ${({ disabled }) => !disabled && 'pointer'};

  &:hover {
    border: 1px solid ${({ isDelete, theme }) => isDelete && theme.colors.error};
    color: ${({ isDelete, theme }) => isDelete && theme.colors.error};
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
