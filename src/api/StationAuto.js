import { getConfigApi } from '../config'
import { deleteFetch, getFetch, postFetch, putFetch } from '../utils/fetch'

function getStationAutoUrl(prefix = '') {
  return getConfigApi().stationAuto + '/' + prefix
}

export function getStationAutos(
  { page = 1, itemPerPage = 10 },
  { address, stationType, name } = {}
) {
  var url = getStationAutoUrl(`?page=${page}&itemPerPage=${itemPerPage}`)
  if (address) url += `&address=${address}`
  if (stationType) url += `&stationType=${stationType}`
  if (name) url += `&name=${name}`
  return getFetch(url)
}

export function getStationAuto(key) {
  return getFetch(getStationAutoUrl(key))
}

// NOTE stationType_id là _id của stationType
export function getTotalCount_by_type(stationType_id) {
  let url = getStationAutoUrl(`count/total-station-by-type`)
  if (stationType_id) url += `?stationType=${stationType_id}`
  return getFetch(url)
}

export function getTotalCount() {
  return getFetch(getStationAutoUrl('subscription/total-count'))
}

export function createStationAuto(measuring = {}) {
  return postFetch(getStationAutoUrl(), measuring)
}

export function updateStationAuto(key, measuring = {}) {
  return putFetch(getStationAutoUrl(key), measuring)
}

export function deleteStationAuto(key) {
  return putFetch(getStationAutoUrl(`delete/${key}`))
}

export function measurePublished(_id, data) {
  return putFetch(getStationAutoUrl(`measure-published/${_id}`), data)
}

export function transferFtp(_id, data) {
  return putFetch(getStationAutoUrl(`transfer-ftp-info/${_id}`), data)
}

export function stationPublished(_id, data) {
  return putFetch(getStationAutoUrl(`station-published/${_id}`), data)
}

export function restoreStationAuto(key) {
  return putFetch(getStationAutoUrl(`restore/${key}`))
}

export function removeStationAuto(key) {
  return deleteFetch(getStationAutoUrl(key))
}

export function getLastLog() {
  return getFetch(getStationAutoUrl('last-log'))
}

export function updateStationAutoConfig(key, data = {}) {
  return putFetch(getStationAutoUrl(`config-logger/${key}`), data)
}

export function getCamera() {
  return getFetch(getStationAutoUrl(`camera`))
}

export default {
  getCamera,
  getStationAutos,
  getStationAuto,
  createStationAuto,
  updateStationAuto,
  deleteStationAuto,
  removeStationAuto,
  restoreStationAuto,
  getLastLog,
  updateStationAutoConfig,
  getTotalCount,
  stationPublished,
  transferFtp,
  measurePublished
}
