import { getConfigApi } from '../config'
import {getFetch, postFetch, putFetch } from '../utils/fetch'

function getStationConfigUrl(prefix = '') {
  return getConfigApi().stationConfig + '/' + prefix
}

export function getStationsConfig(
  { page = 1, itemPerPage = 10000 },
  { stationType, name } = {}
) {
  var url = getStationConfigUrl(`?page=${page}&itemPerPage=${itemPerPage}`)
  if (stationType) url += `&stationType=${stationType}`
  if (name) url += `&name=${name}`
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
  updateStationConfig,
}
