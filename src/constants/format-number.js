import { isNumber } from 'lodash'
export const FORMAT_VALUE_MEASURING = 2 // '*,00'
export const FORMAT_LOCAL = 'en'
export const ROUND_DIGIT = 2 // Làm tròn số thap phan

// format number toFixed(FORMAT_VALUE_MEASURING), format currency 1000 => 1,000 (type EN)
// Hien tai qui ve mot kieu la "EN"
export function getFormatNumber(
  value,
  numberToFixed = FORMAT_VALUE_MEASURING,
  maximum = numberToFixed
) {
  if (isNumber(value) || value) {
    let tempNumber = Number(value).toLocaleString(FORMAT_LOCAL, {
      minimumFractionDigits: numberToFixed,
      maximumFractionDigits: maximum,
    })
    return tempNumber
  }

  return '-'
}

export function getFormatNumberChart(
  value,
  numberToFixed = FORMAT_VALUE_MEASURING,
  maximum = numberToFixed
) {
  if (value) {
    let tempNumber = Number(value).toLocaleString(FORMAT_LOCAL, {
      minimumFractionDigits: numberToFixed,
      maximumFractionDigits: maximum,
    })
    return Number(tempNumber)
  }

  return null
}

export default {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
  getFormatNumberChart,
}
