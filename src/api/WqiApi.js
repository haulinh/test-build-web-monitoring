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

export default {
  fetchWqi,
  fetchWqiData
}
