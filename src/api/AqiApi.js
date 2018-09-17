import { getConfigApi } from '../config'
import { getFetch } from 'utils/fetch'

function getAqiUrl(prefix = '') {
  return getConfigApi().aqi + '/' + prefix
}

export function fetchAqiByHour() {
  return getFetch(getAqiUrl('AIR_QUALITY/hour'))
}

export function fetchAqiByDay(key, params = {}) {
  return getFetch(getAqiUrl(`${key}/day`), undefined, { params })
}

export default {
  fetchAqiByHour,
  fetchAqiByDay
}
