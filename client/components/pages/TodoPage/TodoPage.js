import React from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';

import TodoSection from '_templates/TodoSection';

export default function TodoPage({ listId }) {
  const { todos } = useSelector(R.pick(['todos']));

  return (
    <div className="todo-page page">
      <TodoSection todos={todos.filter((todo) => todo.list === listId)} />
    </div>
  );
}
