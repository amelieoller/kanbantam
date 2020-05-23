import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { attemptAddList } from '_thunks/lists';
import useKeyPress from '_hooks/useKeyPress';
import Button from '_atoms/Button';

export default function AddList({ boardId }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');

  const handleAddList = () => {
    if (title) {
      dispatch(attemptAddList(title, boardId));
      setTitle('');
    }
  };

  useKeyPress('Enter', handleAddList);

  const updateTitle = (e) => setTitle(e.target.value);

  return (
    <div className="add-list columns is-gapless">
      <div className="column is-10">
        <input className="input" type="title" value={title} onChange={updateTitle} />
      </div>
      <div className="column is-2">
        <Button
          style={{ width: '100%' }}
          onClick={handleAddList}
          label="Add"
          type="success"
        />
      </div>
    </div>
  );
}

AddList.propTypes = {
  boardId: PropTypes.string.isRequired,
};
