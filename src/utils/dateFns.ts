export const addDays = (date: Date, amount: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + amount);
  return newDate;
};

export const addMonths = (date: Date, amount: number) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + amount);
  return newDate;
};

export const addYears = (date: Date, amount: number) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + amount);
  return newDate;
};

export const setMonth = (date: Date, month: number) => {
  const newDate = new Date(date);
  newDate.setMonth(month);
  return newDate;
};

export const setYear = (date: Date, year: number) => {
  const newDate = new Date(date);
  newDate.setFullYear(year);
  return newDate;
};

export const setWeekDay = (date: Date, weekday: number) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - newDate.getDay() + weekday);
  return newDate;
};

export const startOfDay = (date: Date) => {
  const newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

export const startOfMonth = (date: Date) => {
  const newDate = new Date(date);
  newDate.setDate(1);
  return startOfDay(newDate);
};

export const endOfMonth = (date: Date) => {
  const newDate = startOfMonth(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(newDate.getDate() - 1);
  return startOfDay(newDate);
};

export const daysInMonth = (date: Date) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(newDate.getDate() - 1);
  return newDate.getDate();
};

export const setDate = (date: Date, day: number) => {
  const newDate = new Date(date);
  newDate.setDate(day);
  return newDate;
};

export const parseDate = (date: string | null | Date, format = 'YYYY-MM-DD'): Date | null => {
  if (date === null || date instanceof Date) {
    return date;
  }
  if (format !== 'YYYY-MM-DD') {
    throw 'ParseDate doesn\'t understand any other formats except YYYY-MM-DD';
  }
  const [, years, months, day] = (String(date).match(/(\d{4})-(\d{1,2})-(\d{1,2})/) || []) as unknown as number[];
  return new Date(Date.UTC(+years, +months - 1, +day));
};

export const isSameDate = (
  a: Date, b: Date,
) => startOfDay(a).getTime() === startOfDay(b).getTime();

export const isAfter = (
  a: Date, b: Date,
) => startOfDay(a).getTime() > startOfDay(b).getTime();

export const isBefore = (
  a: Date, b: Date,
) => startOfDay(a).getTime() < startOfDay(b).getTime();
