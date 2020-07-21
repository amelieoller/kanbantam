import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import useOnClickOutside from '_hooks/useOnClickOutside';
import ListIcon from '_assets/icons/list.svg';

const CategorySelect = ({ onChange, currentCategoryId, noToggle }) => {
  const colorRef = useRef();

  const [isCategoryPickerOpen, setIsCategoryPickerOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');

  useOnClickOutside(colorRef, () => setIsCategoryPickerOpen(false));

  const { categories } = useSelector(R.pick(['categories']));

  useEffect(() => {
    if (categories) {
      const cat = categories.find((c) => c.id === currentCategoryId);

      setCurrentCategory(cat);
    }
  }, [categories, currentCategoryId]);

  const handleChangeComplete = (newCategoryId) => {
    setIsCategoryPickerOpen(false);

    if (currentCategoryId !== newCategoryId) {
      onChange(newCategoryId);
    }
  };

  return (
    <CategorySelectWrapper>
      {!noToggle && (
        <CategoryOption
          color={currentCategory && currentCategory.color}
          onClick={() => setIsCategoryPickerOpen((prevState) => !prevState)}
          isEmpty={!currentCategory}
          isInPicker={false}
        >
          {currentCategory ? currentCategory.title[0] : <ListIcon />}
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
            >
              <ListIcon />
            </CategoryOption>

            {categories.map((c) => (
              <CategoryOption
                color={c.color}
                key={c.id}
                value={c.id}
                onClick={() => handleChangeComplete(c.id)}
                isEmpty={false}
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
  border: 0px solid rgba(0, 0, 0, 0.25);
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
  height: 30px;
  width: 30px;
  position: relative;
  outline: none;
  float: left;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: ${({ isEmpty }) => isEmpty && 'black'};
  border: 2px solid
    ${({ isSelected, theme }) => (isSelected ? theme.colors.primary : theme.colors.surfaceVariant)};
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
