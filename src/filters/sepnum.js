// разделитель чисел на разряды (типа 999 123 500)
export default function sepnum (value, fixed = 0) {
  const formatter = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: fixed
  })
  if (value === '0' && fixed === 2) return '0.00'
  // if (typeof value === 'string') {
  //   const tmpArr = value.split('.')
  //   if (tmpArr.length === 2 && typeof parseInt(tmpArr[0]) === 'number') value = parseInt(tmpArr[0]) + parseInt(tmpArr[1]) / 100
  // }
  if (typeof value !== 'number') {
    return value
  }
  return formatter.format(value).replace(/,/, '.')
}
