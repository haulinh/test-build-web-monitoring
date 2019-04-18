export const FORMAT_VALUE_MEASURING = 2; // '*,00'

export function getFormatNumber(value, numberToFixed = FORMAT_VALUE_MEASURING) {
  if (typeof value === "number") {
    let tempNumber = value.toLocaleString(navigator.language, {
      minimumFractionDigits: numberToFixed,
      maximumFractionDigits: numberToFixed
    });
    return value === 0 ? "0" : tempNumber;
  } else {
    return "0";
  }
}

export default {
  FORMAT_VALUE_MEASURING,
  getFormatNumber
};
