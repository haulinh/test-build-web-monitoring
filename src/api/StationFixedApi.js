import { getConfigApi } from '../config'
import { deleteFetch, getFetch, postFetch, putFetch } from '../utils/fetch'

function getStationFixedUrl(prefix = '') {
  return getConfigApi().stationFixed + '/' + prefix
}

export function getStationFixeds(
  { page = 1, itemPerPage = 10 },
  { address, stationType, name } = {}
) {
  var url = getStationFixedUrl(`?page=${page}&itemPerPage=${itemPerPage}`)
  if (address) url += `&address=${address}`
  if (stationType) url += `&stationType=${stationType}`
  if (name) url += `&name=${name}`
  return getFetch(url)
}

export function getStationFixed(key) {
  return getFetch(getStationFixedUrl(key))
}

export function getTotalCount() {
  return getFetch(getStationFixedUrl('subscription/total-count'))
}

export function createStationFixed(measuring = {}) {
  return postFetch(getStationFixedUrl(), measuring)
}

export function updateStationFixed(key, measuring = {}) {
  return putFetch(getStationFixedUrl(key), measuring)
}

export function deleteStationFixed(key) {
  return putFetch(getStationFixedUrl(`delete/${key}`))
}

export function measurePublished(_id, data) {
  return putFetch(getStationFixedUrl(`measure-published/${_id}`), data)
}

export function transferFtp(_id, data) {
  return putFetch(getStationFixedUrl(`transfer-ftp-info/${_id}`), data)
}

export function stationPublished(_id, data) {
  return putFetch(getStationFixedUrl(`station-published/${_id}`), data)
}

export function restoreStationFixed(key) {
  return putFetch(getStationFixedUrl(`restore/${key}`))
}

export function removeStationFixed(key) {
  return deleteFetch(getStationFixedUrl(key))
}

export function getLastLog() {
  return getFetch(getStationFixedUrl('last-log'))
}

export function getCamera() {
  return getFetch(getStationFixedUrl(`camera`))
}

export default {
  getCamera,
  getStationFixeds,
  getStationFixed,
  createStationFixed,
  updateStationFixed,
  deleteStationFixed,
  removeStationFixed,
  restoreStationFixed,
  getLastLog,
  getTotalCount,
  stationPublished,
  transferFtp,
  measurePublished,
}
