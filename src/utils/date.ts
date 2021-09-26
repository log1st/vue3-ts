export const formatDate = (date: Date, locale?: string, options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}) => (
  date ? (
    new Intl.DateTimeFormat(locale, options)
  ).format(date) : date
);

const weekdayIntl = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'short',
});

export const formatWeekday = (date: Date) => weekdayIntl.format(date);

const dayIntl = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
});

export const formatDay = (date: Date) => dayIntl.format(date);

const monthAndYearIntl = new Intl.DateTimeFormat('ru-RU', {
  year: 'numeric',
  month: 'long',
});

export const formatMonthAndYear = (date: Date) => monthAndYearIntl.format(date);

const yearIntl = new Intl.DateTimeFormat('ru-RU', {
  year: 'numeric',
});

export const formatYear = (date: Date) => yearIntl.format(date);

const monthIntl = new Intl.DateTimeFormat('ru-RU', {
  month: 'long',
});

export const formatMonth = (date: Date) => monthIntl.format(date);

export const dateToApiDate = (date: Date): string | null => {
  if (!date) {
    return null;
  }
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return [year, month, day].join('-');
};
