import moment from 'moment-timezone'
export const formatTime = (time, type) => {
  const getTime = formatType => {
    return moment(time).format(formatType)
  }
  switch (type) {
    case 'month':
      return getTime('MM/YYYY')
    case 'year':
      return getTime('YYYY')
    case 1440:
      return getTime('DD/MM/YYYY')
    default:
      return getTime('DD/MM/YYYY HH:mm')
  }
}
