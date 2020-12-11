import { getConfigApi } from '../../config'
import { getFetch, postFetch, deleteFetch, pathFetch } from '../../utils/fetch'

function getStationFixedPointUrl(prefix = '') {
  return getConfigApi().stationFixedPoint + '/' + prefix
}

export function getStationFixedPoints(
  { page = 1, itemPerPage = 10 },
  { name, stationTypeId }
) {
  let filter = {}
  if (page && itemPerPage) {
    filter = {
      skip: page - 1,
      limit: itemPerPage,
    }
  }
  filter = {
    ...filter,
    where: {
      name: name ? { like: name } : undefined,
      stationTypeId,
    },
  }
  let url = getStationFixedPointUrl()
  return getFetch(url, { filter })
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

export function deactivateStationFixedPoint(Id) {
  return pathFetch(getStationFixedPointUrl(`${Id}/deactivate`))
}
export function activeStationFixedPoint(Id) {
  return pathFetch(getStationFixedPointUrl(`${Id}/active`))
}

export function updateStationFixedPoint(
  Id,
  { name, address, note, mapLocation, stationTypeId, qcvnId, measuringList }
) {
  return pathFetch(getStationFixedPointUrl(Id), {
    name,
    measuringList,
    stationTypeId,
    mapLocation,
    address: address || undefined,
    note: note || undefined,
    qcvnId: qcvnId || undefined,
  })
}
export default {
  getStationFixedPoints,
  getStationFixedPoint,
  createStationFixedPoint,
  deleteStationFixedPoint,
  updateStationFixedPoint,
  deactivateStationFixedPoint,
  activeStationFixedPoint,
}
