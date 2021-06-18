export const formatMoney = (amount, {
  currency = 'RUB',
  withAmount = true,
} = { }) => {
  const value = (
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
    })
  ).format(amount)
    .replace(/^-(.*)/, '— $1');

  return withAmount ? value : value.replace(/([\d.,\s]+)(.*)/, '$2');
};
