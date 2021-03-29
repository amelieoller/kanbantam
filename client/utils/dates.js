const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MS_IN_DAY = 1000 * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;

const utcMilliseconds = (date) => {
  // Discard time and time-zone
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
};

// Input should be JS date object
const dateDiffInDays = (date) => {
  const today = new Date();

  // Discard time and time-zone
  const utc1 = utcMilliseconds(today);
  const utc2 = utcMilliseconds(date);

  return Math.floor((utc2 - utc1) / MS_IN_DAY);
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

export const formatTime = (timePassedMs, sessionLength) => {
  const time = timePassedMs !== 0 ? timePassedMs : sessionLength * 60 * 1000;
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / 1000 / 60) % 60);
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return [minutes, formattedSeconds];
};

// Expects a date created with new Date
export const formatYearMonthDay = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const fullMonth = month < 10 ? `0${month}` : month;
  const fullDay = day < 10 ? `0${day}` : day;

  return `${year}${fullMonth}${fullDay}`;
};

export const minutesToRoughHours = (minutes) => {
  const MINUTES_IN_HOUR = 60;

  if (minutes === 0) return 0;
  if (minutes % MINUTES_IN_HOUR === 0) return `${minutes / MINUTES_IN_HOUR}h`;
  if (minutes > 60) {
    const hours = minutes / MINUTES_IN_HOUR;

    return `${Math.round(hours * 10) / 10}h`;
  }

  return minutes;
};

export const minutesAndHours = (minutes) => {
  const MINUTES_IN_HOUR = 60;

  if (minutes === 0) return 0;
  if (minutes % MINUTES_IN_HOUR === 0) return `${minutes / MINUTES_IN_HOUR}h`;
  if (minutes > 60) {
    const hours = minutes / MINUTES_IN_HOUR;
    const remainderMinutes = minutes % MINUTES_IN_HOUR;

    return `${Math.round(hours)}h${remainderMinutes ? remainderMinutes : ''}m`;
  }

  return `${minutes}m`;
};
