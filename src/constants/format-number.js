export const FORMAT_VALUE_MEASURING = 2 // '*,00'

export function getFormatNumber(value, numberToFixed) {
  if (typeof value === "number") {
    let tempNumber = value.toLocaleString(navigator.language, {
      minimumFractionDigits: numberToFixed
    })
    return tempNumber
  } else {
    return "0"
  }
}

export default {
  FORMAT_VALUE_MEASURING,
  getFormatNumber
}
