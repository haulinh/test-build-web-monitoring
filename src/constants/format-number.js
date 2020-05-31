export const FORMAT_VALUE_MEASURING = 2 // '*,00'
export const FORMAT_LOCAL = 'en'
export const ROUND_DIGIT = 2 // Làm tròn số thap phan

// Hien tai qui ve mot kieu la "EN"
export function getFormatNumber(value, numberToFixed = FORMAT_VALUE_MEASURING) {
  if (typeof value === 'number') {
    let tempNumber = value.toLocaleString(FORMAT_LOCAL, {
      minimumFractionDigits: numberToFixed,
      maximumFractionDigits: numberToFixed,
    })
    return value === 0 ? '0' : tempNumber
  } else {
    return '-'
  }
}

export default {
  FORMAT_VALUE_MEASURING,
  getFormatNumber,
}
