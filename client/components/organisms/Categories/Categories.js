import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as R from 'ramda';
import styled from 'styled-components';

import {
  attemptGetCategories,
  attemptDeleteCategory,
  attemptUpdateCategory,
} from '_thunks/categories';
import AddCategory from '_molecules/AddCategory';
import Trash from '_assets/icons/trash-2.svg';
import UpdateTextButton from '_molecules/UpdateTextButton';

const Categories = ({ boardId }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(R.pick(['categories']));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    boardId && dispatch(attemptGetCategories(boardId)).then(() => setLoading(false));
  }, []);

  const deleteCategory = (id) => dispatch(attemptDeleteCategory(id));

  const handleUpdateCategory = (attribute, id) => {
    dispatch(attemptUpdateCategory({ id: id, ...attribute }));
  };

  return (
    <div>
      {categories &&
        categories.map((c) => (
          <Category key={c.id}>
            <UpdateTextButton
              text={c.title}
              handleUpdate={(newText) => handleUpdateCategory({ title: newText }, c.id)}
            />
            <Trash onClick={() => deleteCategory(c.id)} />
          </Category>
        ))}
      <AddCategory boardId={boardId} />
    </div>
  );
};

const Category = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3px;
`;

Categories.propTypes = {
  boardId: PropTypes.string.isRequired,
};

export default Categories;
