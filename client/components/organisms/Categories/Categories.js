import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import AddCategory from '_molecules/AddCategory';
import Category from '_molecules/Category';

const Categories = ({ boardId }) => {
  const { categories } = useSelector(R.pick(['categories']));

  return (
    <div>
      {categories && categories.map((c) => <Category key={c.id} category={c} />)}
      <AddCategory boardId={boardId} />
    </div>
  );
};

Categories.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default Categories;
