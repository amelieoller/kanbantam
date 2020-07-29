export const byIdReplaceAtIndex = (arr, itemId, newItem) => {
  const index = arr.findIndex((obj) => obj.id === itemId);

  return [...arr.slice(0, index), { ...arr[index], ...newItem }, ...arr.slice(index + 1)];
};

export const filterByCategory = (categoryId, todos) => {
  if (categoryId === '') {
    // Return all todos that don't have a category yet
    return todos.filter((t) => t.category === 'none');
  } else if (categoryId == 'all') {
    // Return all todos
    return todos;
  } else {
    // Return only todos filtered by a particular category
    return todos.filter((t) => t.category === categoryId);
  }
};
