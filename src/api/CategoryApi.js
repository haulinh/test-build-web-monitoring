import { getConfigApi } from 'config'
import { deleteFetch, getFetch, postFetch, putFetch } from 'utils/fetch'

export function getMeasuringUrl(prefix = '') {
  return getConfigApi().measuring + '/' + prefix
}

export function getStationTypeUrl(prefix = '') {
  if (prefix) return getConfigApi().stationType + '/' + prefix
  return getConfigApi().stationType
}

export function getMeasurings(
  { page = 1, itemPerPage = 10 },
  { unit = null, name = null }
) {
  var urlSearch = `${getMeasuringUrl()}?page=${page}&itemPerPage=${itemPerPage}`
  if (unit) urlSearch += `&unit=${unit}`
  if (name) urlSearch += `&name=${name}`
  return getFetch(urlSearch)
}

export function getMeasuring(key) {
  return getFetch(getMeasuringUrl(key))
}

export function createMeasuring(measuring = {}) {
  return postFetch(getMeasuringUrl(), measuring)
}

export function updateMeasuring(key, measuring = {}) {
  return putFetch(getMeasuringUrl(key), measuring)
}

export function deleteMeasuring(key) {
  return deleteFetch(getMeasuringUrl(key))
}

export function getStationTypes(
  { page = 1, itemPerPage = 10 },
  { key = null, name = null, isAuto = null } = {}
) {
  const params = { itemPerPage, page }
  if (isAuto !== null) params.isAuto = isAuto
  if (key) params.key = key
  if (name) params.name = name
  // if (key) urlSearch += `&key=${key}`
  // if (name) urlSearch += `&name=${name}`

  return getFetch(getStationTypeUrl(), undefined, { params })
}

export function getStationType(key) {
  return getFetch(getStationTypeUrl(key))
}

export function createStationType(measuring = {}) {
  return postFetch(getStationTypeUrl(), measuring)
}

export function updateStationType(key, measuring = {}) {
  return putFetch(getStationTypeUrl(key), measuring)
}

export function deleteStationType(key) {
  return deleteFetch(getStationTypeUrl(key))
}

export default {
  getMeasurings,
  getMeasuring,
  createMeasuring,
  updateMeasuring,
  deleteMeasuring,
  getStationTypes,
  getStationType,
  createStationType,
  updateStationType,
  deleteStationType
}
