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

export function fetchAqiHistory(key, { from, to, type } = {}) {
  var url = getAqiUrl(`${key}/histories-statistics?to=${to}&from=${from}`)
  if (type) url += `&type=${type}`
  return getFetch(url)
}
export function exportFileHistory(key, { from, to } = {}) {
  var url = getAqiUrl(`${key}/export-data?to=${to}&from=${from}`)
  return getFetch(url)
}

export default {
  fetchAqiByHour,
  fetchAqiByDay,
  fetchAqiHistory,
  exportFileHistory
}
