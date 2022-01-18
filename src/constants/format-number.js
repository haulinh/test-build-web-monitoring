import _ from 'lodash'
export const FORMAT_VALUE_MEASURING = 2 // '*,00'
export const FORMAT_LOCAL = 'en'
export const ROUND_DIGIT = 2 // Làm tròn số thap phan

// format number toFixed(FORMAT_VALUE_MEASURING), format currency 1000 => 1,000 (type EN)
// Hien tai qui ve mot kieu la "EN"
export function getFormatNumber(value, numberToFixed = FORMAT_VALUE_MEASURING) {
  if (_.isNumber(value) || value) {
    let tempNumber = Number(value).toLocaleString(FORMAT_LOCAL, {
      minimumFractionDigits: numberToFixed,
      maximumFractionDigits: numberToFixed,
    })
    return tempNumber
  }

  return '-'
}

export default {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
}
