import React from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import List from '_molecules/List';

export default function ListList() {
  const { lists } = useSelector(R.pick(['lists']));

  return (
    <ul className="list-list">
      {R.reverse(lists).map((list) => (
        <List key={list.id} {...list} />
      ))}
    </ul>
  );
}
