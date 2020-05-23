import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as R from 'ramda';

import Board from '_molecules/Board';
import Button from '_atoms/Button';

export default function BoardList() {
  const { boards } = useSelector(R.pick(['boards']));

  return (
    <ul className="board-list">
      {R.reverse(boards).map((board) => (
        <Link key={board.id} to={`/boards/${board.id}`}>
          <Button label={board.title} type="success" />
        </Link>
      ))}
    </ul>
  );
}
