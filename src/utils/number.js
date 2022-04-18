import { isNumber } from 'lodash'
export const formatNumberValue = (value, defaultValue = '-') => {
  return isNumber(value) ? value : defaultValue
}
