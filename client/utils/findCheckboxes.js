export const findCheckboxes = (text) => {
  const checkboxes = text.match(/\[(\s|x)\]/g) || [];
  const checked = checkboxes.filter((checkbox) => checkbox === '[x]').length;
  return { total: checkboxes.length, checked };
};
