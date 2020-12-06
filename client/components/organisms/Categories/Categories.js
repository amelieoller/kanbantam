import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import styled from 'styled-components';

import AddCategory from '_molecules/AddCategory';
import Category from '_molecules/Category';

const Categories = ({ boardId }) => {
  const { categories } = useSelector(R.pick(['categories']));

  return (
    <div>
      <CategoriesWrapper>
        {categories && categories.map((c) => <Category key={c.id} category={c} />)}
      </CategoriesWrapper>
      <AddCategory boardId={boardId} />
    </div>
  );
};

const CategoriesWrapper = styled.div`
  max-height: 300px;
  overflow: auto;
`;

Categories.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default Categories;
