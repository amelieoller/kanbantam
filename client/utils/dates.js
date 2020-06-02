// input is a JS date object
const dateDiffInDays = (date) => {
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;

  // Discard time and time-zone
  const utc1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const utc2 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

  return Math.floor((utc2 - utc1) / msPerDay);
};

export const formatDaysToNow = (date) => {
  const dayDifference = dateDiffInDays(date);
  let formattedMessage;

  if (dayDifference === 0) {
    formattedMessage = 'today';
  } else if (dayDifference === 1) {
    formattedMessage = 'tomorrow';
  } else if (dayDifference === -1) {
    formattedMessage = 'yesterday';
  } else if (dayDifference > 1) {
    formattedMessage = `in ${dayDifference} days`;
  } else if (dayDifference < -1) {
    formattedMessage = `${Math.abs(dayDifference)} days ago`;
  }

  return formattedMessage;
};
