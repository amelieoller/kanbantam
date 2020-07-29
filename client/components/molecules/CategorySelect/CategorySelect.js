import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import Button from '_atoms/Button';
import useOnClickOutside from '_hooks/useOnClickOutside';
import useKeyDown from '_hooks/useKeyDown';

const CategorySelect = ({ onChange, currentCategoryId, noToggle }) => {
  const colorRef = useRef();

  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');

  const { categories } = useSelector(R.pick(['categories']));

  useEffect(() => {
    if (categories) {
      const cat = categories.find((c) => c.id === currentCategoryId);

      if (currentCategoryId === 'all') {
        setCurrentCategory({ id: 'all' });
      } else {
        setCurrentCategory(cat);
      }
    }
  }, [categories, currentCategoryId]);

  useOnClickOutside(colorRef, () => setIsCategoryPickerOpen(false));
  useKeyDown('Escape', () => setIsCategoryPickerOpen(false));

  const handleChangeComplete = (newCategoryId) => {
    setIsCategoryPickerOpen(false);

    if (currentCategoryId !== newCategoryId) {
      onChange(newCategoryId);
    }
  };

  return (
    <>
      {!noToggle && (
        <Button
          onClick={() => setIsCategoryPickerOpen((prevState) => !prevState)}
          label="Select category"
          size="large"
          noBackground
        >
          <Circle
            color={currentCategory && currentCategory.color}
            className={currentCategoryId === 'all' ? 'rainbow' : ''}
            notInPicker
          >
            {currentCategory && currentCategory.title ? currentCategory.title[0] : ''}
          </Circle>
        </Button>
      )}

      {(noToggle || isCategoryPickerOpen) && (
        <CategoryOptions ref={colorRef} noToggle={noToggle} className="category-picker">
          <>
            <Button onClick={() => handleChangeComplete('')} label="Select category" noBackground>
              <Circle className="border"></Circle>
              <OptionText isSelected={!currentCategory}>Unassigned</OptionText>
            </Button>

            <Button
              onClick={() => handleChangeComplete('all')}
              label="Select category"
              noBackground
            >
              <Circle color={currentCategory && currentCategory.color} className="rainbow"></Circle>
              <OptionText isSelected={currentCategoryId === 'all'}>All</OptionText>
            </Button>

            {categories.map((c) => (
              <Button
                onClick={() => handleChangeComplete(c.id)}
                label="Select category"
                key={c.id}
                noBackground
              >
                <Circle color={c.color}>{c.title[0]}</Circle>
                <OptionText isSelected={currentCategory ? c.id === currentCategory.id : false}>
                  {c.title}
                </OptionText>
              </Button>
            ))}
          </>
        </CategoryOptions>
      )}
    </>
  );
};

const OptionText = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.lighter(3, 'onBackground')};
  margin-top: 3px;
  text-align: center;
  font-weight: ${({ isSelected }) => (isSelected ? 'bold' : 'normal')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const Circle = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: ${({ notInPicker }) => notInPicker && '2px solid white'};
  font-weight: 900;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 !important;
  background: ${({ color }) => (color ? color : 'white')};

  &.border {
    border: 2px solid ${({ theme }) => theme.colors.lighter(1, 'surfaceVariant')};
  }

  &.rainbow {
    background: linear-gradient(120deg, transparent 36.66%, #fcb900 36.66%) 100% 0,
      linear-gradient(60deg, #eb144c 63.34%, transparent 63.34%) 0 0,
      linear-gradient(-60deg, transparent 36.66%, #9900ef 36.66%) 0 100%,
      linear-gradient(60deg, transparent 36.66%, #00d084 36.66%) 100% 100%,
      linear-gradient(#0693e3, #0693e3) 50% 100%, #ff6900;
    background-repeat: no-repeat;
    background-size: 50% 50%;
  }
`;

const CategoryOptions = styled.div`
  position: ${({ noToggle }) => (noToggle ? 'initial' : 'absolute')};
  top: 45px;
  right: 30px;
  left: 30px;
  background: rgb(255, 255, 255);
  box-shadow: ${({ noToggle }) => !noToggle && 'rgba(0, 0, 0, 0.25) 0px 1px 4px'};
  border: ${({ noToggle, theme }) => noToggle && `1px solid ${theme.colors.surfaceVariant}`};
  border-radius: 4px;
  padding: ${({ theme }) => theme.sizes.spacingSmall};
  display: grid;
  grid-gap: ${({ theme }) => theme.sizes.spacingSmall};
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  min-width: 100px;

  button {
    flex-direction: column;
    border: none;
    border: ${({ isSelected, theme }) =>
      isSelected && `2px solid ${theme.colors.lighter(2, 'onBackground')}`};
    padding: 5px;
    outline: none;

    & > *:first-child {
      width: 35px;
      height: 35px;
    }

    &:hover,
    &:focus {
      background: ${({ theme }) => theme.colors.lighter(9, 'onBackground')};
    }
  }
`;

CategorySelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentCategoryId: PropTypes.string,
  noToggle: PropTypes.bool,
};

CategorySelect.defaultProps = {
  currentCategoryId: '',
  noToggle: false,
};

export default CategorySelect;
