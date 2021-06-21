const dateIntl = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const formatDate = (date) => dateIntl.format(new Date(date));

const dateTimeIntl = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export const formatDateTime = (date) => dateTimeIntl.format(date);

const monthAndYearIntl = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
});

export const formatMonthAndYear = (date) => monthAndYearIntl.format(date);

const monthIntl = new Intl.DateTimeFormat(undefined, {
  month: 'long',
});

export const formatMonth = (date) => monthIntl.format(date);

const yearIntl = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
});

export const formatYear = (date) => yearIntl.format(date);

const weekdayIntl = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
});

export const formatWeekday = (date) => weekdayIntl.format(date);

const dayIntl = new Intl.DateTimeFormat(undefined, {
  day: 'numeric',
});

export const formatDay = (date) => dayIntl.format(date);

export const formatAgo = (milliseconds) => {
  let interval = Math.max(Math.floor(milliseconds / 1000), 0);

  if (interval > 60) {
    interval /= 60;
    if (interval > 24) {
      interval /= 24;
      return interval > 1 ? null : [Math.floor(interval), 'hours'];
    }
    return [Math.floor(interval), 'minutes'];
  }
  return [Math.floor(interval), 'seconds'];
};

export const formatTime = (secondsAmount) => {
  const hours = Math.floor(secondsAmount / 3600);
  const minutes = Math.floor((secondsAmount - (hours * 3600)) / 60);
  const seconds = secondsAmount - (hours * 3600) - (minutes * 60);

  return [hours, minutes, seconds].filter(Boolean).map((i) => String(i).padStart(2, '0')).join(':');
};

export const formatTimeout = (seconds) => (
  [Math.floor(seconds / 60), seconds % 60].map((i) => String(i).padStart(2, '0')).join(':')
);
