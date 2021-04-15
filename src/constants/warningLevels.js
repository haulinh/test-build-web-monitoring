import _ from 'lodash'
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
  // if (value == 103.24) {
  //   console.log({ maxLimit, minLimit, maxTend, minTend, colorLevels: colorLevels.EXCEEDED })
  //   console.log("Condition match: " + ((minLimit && value < minLimit) || (maxLimit && value > maxLimit)))
  // }
  if ((_.isNumber(minLimit) && value < minLimit) || (_.isNumber(maxLimit) && value > maxLimit)) {
    // if (value == 103.24) {
    //   console.log({ maxLimit, minLimit, maxTend, minTend, colorLevels: colorLevels.EXCEEDED })
    // }
    return colorLevels.EXCEEDED
  } else if ((minTend && value < minTend) || (maxTend && value > maxTend)) {
    return colorLevels.EXCEEDED_TENDENCY
  } else {
    return colorGood ? colorGood : colorLevels.GOOD
  }
}

export const getColorStatusDevice = (status) => {
  if (status === 1) {
    return colorLevels.MAINTAIN
  } else if (status === 2) {
    return colorLevels.ERROR
  }

  // return colorLevels.GOOD
}

export default { warningLevels, colorLevels, warningLevelsNumber }
