export const getDeepField = (object, field, delimiter = '.') => {
  return field.split(delimiter).reduce((acc, cur) => acc[cur], object)
}
