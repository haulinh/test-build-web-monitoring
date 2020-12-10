import { getConfigApi } from '../../config'
import { getFetch, postFetch, deleteFetch, pathFetch } from '../../utils/fetch'

export function getStationFixedPointUrl(prefix = '') {
  return getConfigApi().stationFixedPoint + '/' + prefix
}

export function getStationFixedPoints({ page = 1, itemPerPage = 10 }) {
  let url = getStationFixedPointUrl(`?skip=${page - 1}&limit=${itemPerPage}`)
  return getFetch(url)
}

export function getStationFixedPoint(id) {
  let url = getStationFixedPointUrl(id)
  return getFetch(url)
}

export function createStationFixedPoint(data = {}) {
  let url = getStationFixedPointUrl('')
  return postFetch(url, data)
}

export function deleteStationFixedPoint(Id) {
  return deleteFetch(getStationFixedPointUrl(Id))
}

export function updateStationFixedPoint(Id, { name, stationTypeId }) {
  return pathFetch(getStationFixedPointUrl(Id), { name, stationTypeId })
}

export function importDataStationFixed(data) {
  return postFetch(getStationFixedPointUrl('import-data'), data)
}

export function downloadTemplateFile() {
  return getFetch(getStationFixedPointUrl('export-data-template'))
}

export default {
  getStationFixedPoints,
  getStationFixedPoint,
  createStationFixedPoint,
  deleteStationFixedPoint,
  updateStationFixedPoint,
}
