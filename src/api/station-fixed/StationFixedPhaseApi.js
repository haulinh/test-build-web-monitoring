import { getConfigApi } from '../../config'
import { deleteFetch, getFetch, pathFetch, postFetch } from '../../utils/fetch'

function getStationFixedPhaseUrl(prefix = '') {
  return getConfigApi().stationFixedPhase + '/' + prefix
}

export function getStationFixedPhases({ page = 1, itemPerPage = 10 }) {
  let url = getStationFixedPhaseUrl(`?page=${page}&itemPerPage=${itemPerPage}`)
  return getFetch(url)
}

export function getStationFixedPhase(id) {
  let url = getStationFixedPhaseUrl(id)
  return getFetch(url)
}

export function createStationFixedPhase(data = {}) {
  let url = getStationFixedPhaseUrl('')
  return postFetch(url, data)
}

export function deleteStationFixedPhase(Id) {
  return deleteFetch(getStationFixedPhaseUrl(Id))
}

export function updateStationFixedPhase(Id, { name, stationTypeId }) {
  return pathFetch(getStationFixedPhaseUrl(Id), { name, stationTypeId })
}

export function getPhase(filter) {
  const url = getStationFixedPhaseUrl()
  return getFetch(url, filter)
}

export default {
  getStationFixedPhases,
  getStationFixedPhase,
  createStationFixedPhase,
  deleteStationFixedPhase,
  updateStationFixedPhase,
}
