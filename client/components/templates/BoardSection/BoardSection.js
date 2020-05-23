import React from 'react';
import AddBoard from '_molecules/AddBoard';
import BoardList from '_organisms/BoardList';

export default function BoardSection() {
  return (
    <div className="section board-section">
      <h1 className="title is-1 has-text-centered">All Boards:</h1>
      <div className="columns">
        <div className="column is-8 is-offset-2 text-center">
          <AddBoard />
        </div>
      </div>
      <div className="columns">
        <div className="column is-8 is-offset-2 text-left">
          <BoardList />
        </div>
      </div>
    </div>
  );
}
