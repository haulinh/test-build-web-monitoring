import moment from 'moment'
import { getLanguage } from 'utils/localStorage'

const getTimes = rangeTime => {
  if (Array.isArray(rangeTime)) {
    return {
      from: moment(rangeTime[0]).startOf('d'),
      to: moment(rangeTime[1]).endOf('d'),
    }
  }
  if (rangeTime === 1) {
    return {
      from: moment().subtract(1, 'd'),
      to: moment(),
    }
  }
  return {
    from: moment()
      .subtract(rangeTime, 'd')
      .startOf('d'),
    to: moment()
      .subtract(1, 'd')
      .endOf('d'),
  }
}

export const getTimesUTC = times => {
  const from = times.from
    .clone()
    .utc()
    .format()
  const to = times.to
    .clone()
    .utc()
    .format()

  return {
    from,
    to,
  }
}

const quarterSysbol = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
}

export const formatQuarter = (time, lang = getLanguage()) => {
  if (lang === 'vi')
    return moment(time).format(
      `[Quý ${quarterSysbol[moment(time).quarter()]}] YYYY`
    )
  return moment(time).format('Qo [quarter] YYYY')
}

export { getTimes }
