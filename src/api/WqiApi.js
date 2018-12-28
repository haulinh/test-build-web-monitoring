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
  var url = getWqiUrl(`${key}/histories?to=${to}&from=${from}`)
  return getFetch(url)
}

export default {
  fetchWqi,
  fetchWqiData,
  fetchWqiHistory
}
