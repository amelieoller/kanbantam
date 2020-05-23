import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import AddList from '_molecules/AddList';
import List from '_molecules/List';

export default function ListSection({ boardId }) {
  // get all lists belonging to this board
  const { lists } = useSelector(R.pick(['lists']));

  return (
    <div className="section board-section">
      <h2>Add new list for this board:</h2>
      <AddList boardId={boardId} />

      {R.reverse(lists).map((list) => (
        <List key={list.id} {...list} boardId={boardId} />
      ))}
    </div>
  );
}

ListSection.propTypes = {
  boardId: PropTypes.string.isRequired,
};
