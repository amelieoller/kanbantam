export const sortByProp = (a, b, prop) => {
  if (!a || !b) return 0;
  if (!a[prop] && !b[prop]) return 0;
  if (!b[prop]) return 1;
  if (!a[prop]) return -1;
  if (a[prop] > b[prop]) return 1;
  if (a[prop] < b[prop]) return -1;
  return 0;
};

export const sortByName = (a, b) => {
  if (!a || !b) return 0;
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

export const sortByOrder = (a, b) => {
  if (!a || !b) return 0;
  if (a.order < b.order) return -1;
  if (a.order > b.order) return 1;
  return 0;
};

export const sortItemsByOrder = (items) => items.sort(sortByOrder);

export const calculateIndex = (prevTodo, nextTodo, nCards = 1) => {
  let base, increment;

  // If we drop the card to an empty column
  if (!prevTodo && !nextTodo) {
    base = 0;
    increment = 1;
    // If we drop the card in the first position
  } else if (!prevTodo) {
    base = nextTodo.order - 1;
    increment = -1;
    // If we drop the card in the last position
  } else if (!nextTodo) {
    base = prevTodo.order + 1;
    increment = 1;
  }
  // In the general case take the average of the previous and next element
  // sort indexes.
  else {
    const prevSortIndex = prevTodo.order;
    const nextSortIndex = nextTodo.order;
    increment = (nextSortIndex - prevSortIndex) / (nCards + 1);
    base = prevSortIndex + increment;
  }

  // XXX Return a generator that yield values instead of a base with a
  // increment number.
  return {
    base,
    increment,
  };
};

export const calculateNewOrder = (items, index) => {
  const prevItem = items[index - 1];
  const nextItem = items[index + 1];
  const newItemSort = calculateIndex(prevItem, nextItem, items.length);

  return newItemSort.base;
};
