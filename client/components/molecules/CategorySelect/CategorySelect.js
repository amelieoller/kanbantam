import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import Modal from 'react-modal';

import Button from '_atoms/Button';

const CategorySelect = ({ onChange, currentCategoryId, noToggle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');

  const { categories } = useSelector(R.pick(['categories']));

  useEffect(() => {
    if (currentCategoryId === 'all') {
      setCurrentCategory({ id: 'all' });
    } else if (categories) {
      const cat = categories.find((c) => c.id === currentCategoryId);
      setCurrentCategory(cat);
    }
  }, [categories, currentCategoryId]);

  const handleChangeComplete = (newCategoryId) => {
    setIsModalOpen(false);

    if (currentCategoryId !== newCategoryId) {
      onChange(newCategoryId);
    }
  };

  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen((prevState) => !prevState);

  const customStyles = {
    content: {
      left: 'auto',
      right: '0',
      bottom: 'auto',
      padding: '0',
      margin: '5px',
      border: 'none',
    },
  };

  const renderCategoryOptions = () => (
    <CategoryOptionsComponent
      handleChangeComplete={handleChangeComplete}
      currentCategory={currentCategory}
      currentCategoryId={currentCategoryId}
      categories={categories}
    />
  );

  return (
    <>
      {noToggle ? (
        renderCategoryOptions()
      ) : (
        <>
          <Button onClick={toggleModal} label="Select category" size="large" noBackground>
            <Circle
              color={currentCategory && currentCategory.color}
              className={currentCategoryId === 'all' ? 'rainbow' : ''}
              notInPicker
            >
              {currentCategory && currentCategory.title ? currentCategory.title[0] : ''}
            </Circle>
          </Button>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Category Modal"
            style={customStyles}
          >
            {renderCategoryOptions()}
          </Modal>
        </>
      )}
    </>
  );
};

const CategoryOptionsComponent = ({
  handleChangeComplete,
  currentCategory,
  currentCategoryId,
  categories,
}) => {
  console.log('currentCategory', currentCategory);
  console.log('currentCategoryId', currentCategoryId);
  console.log('categories', categories);
  return (
    <CategoryOptions className="category-picker">
      <>
        <Button onClick={() => handleChangeComplete('')} label="Select category" noBackground>
          <Circle className="border"></Circle>
          <OptionText isSelected={!currentCategory}>Unassigned</OptionText>
        </Button>

        <Button onClick={() => handleChangeComplete('all')} label="Select category" noBackground>
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
  background: rgb(255, 255, 255);
  border: ${({ theme }) => `1px solid ${theme.colors.surfaceVariant}`};
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

CategoryOptionsComponent.propTypes = {
  handleChangeComplete: PropTypes.func.isRequired,
  currentCategoryId: PropTypes.string,
  currentCategory: PropTypes.shape({
    color: PropTypes.string,
    id: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({ title: PropTypes.string, color: PropTypes.string, id: PropTypes.string }),
  ),
};

export default CategorySelect;
