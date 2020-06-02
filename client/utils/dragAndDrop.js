import { calculateIndex } from './sorting';

// Reorder the result
const reorder = (list, startIndex, endIndex) => {
  const result = [...list];

  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export default reorder;

export const reorderQuoteMap = ({ quoteMap, source, destination }) => {
  const current = [...quoteMap[source.droppableId]];
  const next = [...quoteMap[destination.droppableId]];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const nCards = next.length;
    const reordered = reorder(current, source.index, destination.index);

    const prevTodo = reordered[destination.index - 1];
    const nextTodo = reordered[destination.index + 1];
    const currentTodo = reordered[destination.index];

    const newTodoSort = calculateIndex(prevTodo, nextTodo, nCards);

    const result = {
      ...quoteMap,
      [source.droppableId]: reordered,
    };

    const updatedTodo = { ...currentTodo, order: newTodoSort.base };

    return {
      quoteMap: result,
      updatedTodo: updatedTodo,
    };
  }

  // moving to different list
  const nCards = next.length + 1;

  const prevTodo = next[destination.index - 1];
  const nextTodo = next[destination.index];
  const currentTodo = current[source.index];

  const newTodoSort = calculateIndex(prevTodo, nextTodo, nCards);

  const updatedTodo = {
    ...currentTodo,
    order: newTodoSort.base,
    list: destination.droppableId,
  };

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result = {
    ...quoteMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    quoteMap: result,
    updatedTodo: updatedTodo,
  };
};
