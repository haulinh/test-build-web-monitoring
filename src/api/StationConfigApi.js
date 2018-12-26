import { getConfigApi } from '../config'
import { getFetch, postFetch, putFetch } from '../utils/fetch'

function getStationConfigUrl(prefix = '') {
  if (prefix) {
    return getConfigApi().stationConfig + '/' + prefix
  }
  return getConfigApi().stationConfig
}

export function getStationsConfig(
  { page = 1, itemPerPage = 10000 },
  { stationType, name, config } = {}
) {
  var url = getStationConfigUrl(`?page=${page}&itemPerPage=${itemPerPage}`)
  if (stationType) url += `&stationType=${stationType}`
  if (name) url += `&name=${name}`
  if (config) url += `&config=${config}`
  return getFetch(url)
}

export function getStationConfigByKey(key) {
  return getFetch(getStationConfigUrl(key))
}

export function createStationConfig(data = {}) {
  return postFetch(getStationConfigUrl(), data)
}

export function updateStationConfig(_id, measuring = {}) {
  return putFetch(getStationConfigUrl(_id), measuring)
}

export default {
  getStationsConfig,
  getStationConfigByKey,
  createStationConfig,
  updateStationConfig
}
