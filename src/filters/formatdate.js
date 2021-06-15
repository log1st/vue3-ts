 const twoSimbols = (str) => {
  str = '0' + str
  return str.slice(-2)
}


export default function (date, haw = false) { // приведение даты к виду DD.MM.YYYY hh:mm
  if (!date) return date
  if (typeof date === 'number' || typeof date === 'object') {
    const res1 = twoSimbols(new Date(date).getDate()) + '.' + twoSimbols(new Date(date).getMonth() + 1) + '.' + new Date(date).getFullYear()
    const res2 = twoSimbols(new Date(date).getHours()) + ':' + twoSimbols(new Date(date).getMinutes())
    return haw ? res1 : res1 + ' ' + res2
  }
}
