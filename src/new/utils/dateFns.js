export const addDays = (date, amount) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + amount);
  return newDate;
};

export const addMonths = (date, amount) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + amount);
  return newDate;
};

export const addYears = (date, amount) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + amount);
  return newDate;
};

export const setMonth = (date, month) => {
  const newDate = new Date(date);
  newDate.setMonth(month);
  return newDate;
};

export const setYear = (date, year) => {
  const newDate = new Date(date);
  newDate.setFullYear(year);
  return newDate;
};

export const setWeekDay = (date, weekday) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() - newDate.getDay() + weekday);
  return newDate;
};

export const startOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

export const startOfMonth = (date) => {
  const newDate = new Date(date);
  newDate.setDate(1);
  return startOfDay(newDate);
};

export const endOfMonth = (date) => {
  const newDate = startOfMonth(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(newDate.getDate() - 1);
  return startOfDay(newDate);
};

export const daysInMonth = (date) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  newDate.setDate(newDate.getDate() - 1);
  return newDate.getDate();
};

export const setDate = (date, day) => {
  const newDate = new Date(date);
  newDate.setDate(day);
  return newDate;
};

export const isSameDate = (
  a, b
) => startOfDay(a).getTime() === startOfDay(b).getTime();

export const isAfter = (
  a, b
) => startOfDay(a).getTime() > startOfDay(b).getTime();

export const isBefore = (
  a, b
) => startOfDay(a).getTime() < startOfDay(b).getTime();
