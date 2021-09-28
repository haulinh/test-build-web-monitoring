export const getParamArray = value => {
  if (Array.isArray(value)) return value.join(',')
  return value
}
