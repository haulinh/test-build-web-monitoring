export const warningLevels = {
  LOSS: 'DATA_LOSS',
  GOOD: 'GOOD',
  EXCEEDED_TENDENCY: 'EXCEEDED_TENDENCY',
  EXCEEDED_PREPARING: 'EXCEEDED_PREPARING',
  EXCEEDED: 'EXCEEDED',
  DEFAULT: 'GOOD',
}

export const colorLevels = {
  LOSS: 'DATA_LOSS',
  GOOD: '#2CCA73',
  EXCEEDED_TENDENCY: '#F1D748',
  MAINTAIN: '#EDC30F',
  EXCEEDED_PREPARING: '#F08432',
  EXCEEDED: '#EA3223',
  ERROR: '#E54C3C',
}

export const warningLevelsNumber = {
  GOOD: 1,
  EXCEEDED_TENDENCY: 2,
  EXCEEDED_PREPARING: 3,
  EXCEEDED: 4,
}

export const getcolorMeasure = (
  value,
  { maxLimit, minLimit, maxTend, minTend },
  colorGood
) => {
  if ((minLimit && value < minLimit) || (maxLimit && value > maxLimit)) {
    return colorLevels.EXCEEDED
  } else if ((minTend && value < minTend) || (maxTend && value > maxTend)) {
    return colorLevels.EXCEEDED_TENDENCY
  } else {
    return colorGood ? colorGood : colorLevels.GOOD
  }
}

export default { warningLevels, colorLevels, warningLevelsNumber }
