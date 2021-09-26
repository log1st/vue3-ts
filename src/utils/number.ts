export const getRandomNumber = (
  to = Number.MAX_VALUE,
  from = 0,
): number => Math.floor(Math.random() * to) + from;
