import { formatYearMonthDay } from '_utils/dates';

const weekDaysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const byIdReplaceAtIndex = (arr, itemId, newItem) => {
  const index = arr.findIndex((obj) => obj.id === itemId);

  return [...arr.slice(0, index), { ...arr[index], ...newItem }, ...arr.slice(index + 1)];
};

export const filterByCategory = (categoryId, todos) => {
  if (categoryId === '') {
    // Return all todos that don't have a category yet
    return todos.filter((t) => t.category === 'none' || t.category === '');
  } else if (categoryId == 'all') {
    // Return all todos
    return todos;
  } else {
    // Return only todos filtered by a particular category
    return todos.filter((t) => t.category === categoryId);
  }
};

export const todosByDate = (todos, date) => {
  return todos
    .filter(
      (t) =>
        t.completedAt && formatYearMonthDay(new Date(t.completedAt)) === formatYearMonthDay(date),
    )
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
};

export const todosByDateFromToday = (todos, days) => {
  let date = new Date();
  date.setDate(date.getDate() + days);

  const listOfTodos = todosByDate(todos, date);
  const dateText = weekDaysFull[date.getDay()];

  return [listOfTodos, dateText];
};
