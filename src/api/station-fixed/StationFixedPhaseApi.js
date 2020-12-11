import { getConfigApi } from '../../config'
import { getFetch, postFetch, deleteFetch, pathFetch } from '../../utils/fetch'

function getStationFixedPhaseUrl(prefix = '') {
  return getConfigApi().stationFixedPhase + '/' + prefix
}

export function getStationFixedPhases({ page = 1, itemPerPage = 10 }) {
  let url = getStationFixedPhaseUrl('')

  const filter = {
    skip: page - 1,
    limit: itemPerPage,
    include: [
      {
        relation: 'stationType',
      },
    ],
  }
  return getFetch(url, { filter })
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
export default {
  getStationFixedPhases,
  getStationFixedPhase,
  createStationFixedPhase,
  deleteStationFixedPhase,
  updateStationFixedPhase,
}
