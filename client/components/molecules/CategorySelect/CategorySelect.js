import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import useOnClickOutside from '_hooks/useOnClickOutside';

const CategorySelect = ({ onChange, currentCategoryId, noToggle }) => {
  const colorRef = useRef();

  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');

  useOnClickOutside(colorRef, () => setIsCategoryPickerOpen(false));

  const { categories } = useSelector(R.pick(['categories']));

  useEffect(() => {
    if (categories) {
      const cat = categories.find((c) => c.id === currentCategoryId);

      if (currentCategoryId === 'all') {
        setCurrentCategory('all');
      } else {
        setCurrentCategory(cat);
      }
    }
  }, [categories, currentCategoryId]);

  const handleChangeComplete = (newCategoryId) => {
    setIsCategoryPickerOpen(false);

    if (currentCategoryId !== newCategoryId) {
      onChange(newCategoryId);
    }
  };

  console.log(currentCategory);

  return (
    <CategorySelectWrapper>
      {!noToggle && (
        <CategoryOption
          color={currentCategory && currentCategory.color}
          onClick={() => setIsCategoryPickerOpen((prevState) => !prevState)}
          isEmpty={!currentCategory}
          isInPicker={false}
          className={currentCategory === 'all' ? 'rainbow' : ''}
        >
          {currentCategory && currentCategory.title ? currentCategory.title[0] : ''}
        </CategoryOption>
      )}

      {(noToggle || isCategoryPickerOpen) && (
        <CategoryOptions ref={colorRef} noToggle={noToggle}>
          <>
            <CategoryOption
              value=""
              onClick={() => handleChangeComplete('')}
              isEmpty={true}
              isInPicker
              isSelected={!currentCategory}
              className="border"
            ></CategoryOption>

            <CategoryOption
              value=""
              onClick={() => handleChangeComplete('all')}
              isEmpty={true}
              isInPicker
              isSelected={currentCategory === 'all'}
              className="rainbow"
            ></CategoryOption>

            {categories.map((c) => (
              <CategoryOption
                color={c.color}
                key={c.id}
                value={c.id}
                onClick={() => handleChangeComplete(c.id)}
                isEmpty={false}
                isInPicker
                isSelected={currentCategory ? c.id === currentCategory.id : false}
              >
                {c.title[0]}
              </CategoryOption>
            ))}
          </>
        </CategoryOptions>
      )}
    </CategorySelectWrapper>
  );
};

const CategorySelectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const CategoryOptions = styled.div`
  position: ${({ noToggle }) => (noToggle ? 'initial' : 'absolute')};
  top: 45px;
  right: 0;
  background: rgb(255, 255, 255);
  /* border: 0px solid rgba(0, 0, 0, 0.25); */
  box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 4px;
  border-radius: 4px;
  padding: ${({ theme }) => theme.sizes.spacingSmall};
  display: grid;
  grid-gap: ${({ theme }) => theme.sizes.spacingSmall};
  grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
  min-width: 100px;
`;

const CategoryOption = styled.div`
  cursor: pointer;
  background: ${({ color }) => (color ? color : 'white')};
  height: 25px;
  width: 25px;
  position: relative;
  outline: none;
  float: left;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: ${({ isEmpty }) => isEmpty && 'white'};
  border-radius: 50%;
  font-size: 14px;
  border: ${({ isInPicker }) => (isInPicker ? 'none' : '2px solid')};
  border: ${({ isSelected, theme }) =>
    isSelected && `2px solid ${theme.colors.lighter(2, 'onBackground')}`};

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

CategorySelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  currentCategoryId: PropTypes.string,
  noToggle: PropTypes.bool,
};

CategorySelect.defaultProps = {
  currentCategoryId: '',
};

export default CategorySelect;
