import moment from 'moment'
import { getLanguage } from 'utils/localStorage'

const getTimes = (rangeTime, { isOriginal } = { isOriginal: false }) => {
  if (Array.isArray(rangeTime) && isOriginal) {
    return {
      from: moment(rangeTime[0]),
      to: moment(rangeTime[1]),
    }
  }

  if (Array.isArray(rangeTime)) {
    return {
      from: moment(rangeTime[0]).startOf('day'),
      to: moment(rangeTime[1]).endOf('day'),
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

export const getTimeUTC = time =>
  time
    .clone()
    .utc()
    .format()

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

const timeLang = {
  vi: {
    day: day => `${day} ngày`,
    hour: hour => `${hour} giờ`,
    minute: minute => `${minute} phút`,
  },
  en: {
    day: day => `${day} ${day > 1 ? 'days' : 'day'}`,
    hour: hour => `${hour} ${hour > 1 ? 'hours' : 'hour'}`,
    minute: minute => `${minute} ${minute > 1 ? 'minutes' : 'minute'}`,
  },
  tw: {
    day: day => `${day} 日`,
    hour: hour => `${hour} 小時`,
    minute: minute => `${minute} 分鐘`,
  },
}

export const getDurationTime = (params, lang) => {
  const { from, to } = params

  if (!to) return
  const duration = moment.duration(moment(to).diff(from))
  const day = Math.floor(moment.duration(duration).asDays())
  const hour = moment.duration(duration).hours()
  const minute = moment.duration(duration).minutes()
  console.log(duration, '')

  const time = timeLang[lang]

  return [
    day ? time.day(day) : '',
    hour ? time.hour(hour) : '',
    minute ? time.minute(minute) : '',
  ]
    .filter(Boolean)
    .join(' ')
}
