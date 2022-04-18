import { isNumber } from 'lodash'
export const formatNumberValue = (checkValue, returnValue) => {
  return isNumber(checkValue) ? checkValue : returnValue
}
