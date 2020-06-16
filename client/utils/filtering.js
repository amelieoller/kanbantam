export const byIdReplaceAtIndex = (arr, itemId, newItem) => {
  const index = arr.findIndex((obj) => obj.id === itemId);

  return [...arr.slice(0, index), { ...arr[index], ...newItem }, ...arr.slice(index + 1)];
};
