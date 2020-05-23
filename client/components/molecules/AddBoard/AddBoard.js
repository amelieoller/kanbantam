import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { attemptAddBoard } from '_thunks/boards';
import useKeyPress from '_hooks/useKeyPress';
import Button from '_atoms/Button';

export default function AddBoard() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');

  const handleAddBoard = () => {
    if (title) {
      dispatch(attemptAddBoard(title));
      setTitle('');
    }
  };

  useKeyPress('Enter', handleAddBoard);

  const updateTitle = (e) => setTitle(e.target.value);

  return (
    <div className="add-board columns is-gapless">
      <div className="column is-10">
        <input className="input" type="title" value={title} onChange={updateTitle} />
      </div>
      <div className="column is-2">
        <Button
          style={{ width: '100%' }}
          onClick={handleAddBoard}
          label="Add"
          type="success"
        />
      </div>
    </div>
  );
}
