import { getConfigApi } from '../config'
import { getFetch } from 'utils/fetch'

function getAqiUrl(prefix = '') {
  return getConfigApi().aqi + '/' + prefix
}

export function fetchAqiByHour() {
  return getFetch(getAqiUrl('AIR_QUALITY/hour-last-logs'))
}

export function fetchAqiByDay(key, params = {}) {
  return getFetch(getAqiUrl(`${key}/aqi-day-last-logs`), undefined, { params })
}

export default {
  fetchAqiByHour,
  fetchAqiByDay
}
