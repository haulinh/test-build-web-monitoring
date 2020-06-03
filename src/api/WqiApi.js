import { getConfigApi } from '../config'
import { getFetch } from 'utils/fetch'

// SURFACE_WATER
function getWqiUrl(prefix = '') {
  return getConfigApi().wqi + '/' + prefix
}

export function fetchWqi() {
  return getFetch(getWqiUrl('SURFACE_WATER/last-log'))
}

export function fetchWqiData(key, from) {
  return getFetch(getWqiUrl(`${key}/data-last-log/?time=${from}`))
}

export function fetchWqiHistory(key, { from, to } = {}) {
  var url = getWqiUrl(`${key}/histories-statistics?to=${to}&from=${from}`)
  return getFetch(url)
}

export function exportFileHistory(key, { from, to } = {}) {
  var url = getWqiUrl(`${key}/export-data?to=${to}&from=${from}`)
  return getFetch(url)
}

// NOTE
const SLUG_WQI_VS = 'v1'
export function fetchWQILastLogs({ listKey } = {}) {
  var url = getWqiUrl(`${SLUG_WQI_VS}/hour-last-logs?listKey=${listKey}`)
  return getFetch(url)
}

export default {
  fetchWqi,
  fetchWqiData,
  fetchWqiHistory,
  exportFileHistory,
  fetchWQILastLogs,
}
