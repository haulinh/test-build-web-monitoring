import moment from 'moment'

const getTimes = rangeTime => {
  // console.log(rangeTime, '==rangeTime==')

  // trong khoang
  if (Array.isArray(rangeTime)) {
    return {
      from: rangeTime[0],
      to: rangeTime[1],
    }
  }

  // 24h
  if (rangeTime === 1) {
    return {
      from: moment().subtract(1, 'd'),
      to: moment(),
    }
  }

  // cac options khac
  return {
    from: moment()
      .subtract(1 + rangeTime, 'd')
      .startOf('d'),
    to: moment()
      .subtract(1, 'd')
      .endOf('d')
  }
}

export { getTimes }