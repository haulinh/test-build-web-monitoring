import { getFetch, postFetch, deleteFetch, pathFetch } from 'utils/fetch'
import { getConfigApi } from '../../config'

export function getStationFixedPeriodicUrl(prefix = '') {
  return getConfigApi().stationFixedPeriodic + '/' + prefix
}

export async function getStationFixedPeriodics(
  { page = 1, itemPerPage = 100 },
  { name, stationTypeId } = {},
  where = {}
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
      additionalProp1: {},
    },
  }
  let url = getStationFixedPeriodicUrl()
  return getFetch(url, { filter })
}

export function getStationFixedPeriodic(id) {
  let url = getStationFixedPeriodicUrl(id)
  return getFetch(url)
}

export function createStationFixedPeriodic(data = {}) {
  let url = getStationFixedPeriodicUrl('')
  return postFetch(url, data)
}

export function deleteStationFixedPeriodic(Id) {
  return deleteFetch(getStationFixedPeriodicUrl(Id))
}

export function deactivateStationFixedPeriodic(Id) {
  return pathFetch(getStationFixedPeriodicUrl(`${Id}/deactivate`))
}

export function activeStationFixedPeriodic(Id) {
  return pathFetch(getStationFixedPeriodicUrl(`${Id}/active`))
}
export default {
  getStationFixedPeriodics,
  getStationFixedPeriodic,
  createStationFixedPeriodic,
  deleteStationFixedPeriodic,
  deactivateStationFixedPeriodic,
  activeStationFixedPeriodic,
}
