import { getLanguage } from 'utils/localStorage'
import { getConfigApi } from '../../config'
import {
  getFetch,
  postFetch,
  deleteFetch,
  pathFetch,
  getFetchDownFile,
} from 'utils/fetch'

export function getStationFixedPointUrl(prefix = '') {
  return getConfigApi().stationFixedPoint + '/' + prefix
}

export function exportDataTemplate(measurings = []) {
  const lang = getLanguage()
  const url = getStationFixedPointUrl('export-data-template') + '/' + lang
  return getFetchDownFile(url, { measurings })
}

export async function getStationFixedPoints(
  { page = 1, itemPerPage = 1000 },
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
      name: name ? { like: name, options: 'i' } : undefined,
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
  {
    name,
    address,
    note,
    mapLocation,
    stationTypeId,
    qcvnId,
    measuringList,
    position,
    provinceId,
    website,
    yearOperate,
    userResponsible,
    userSupervisor,
    phoneResponsible,
    phoneSupervisor,
    irrigationArea,
    purposeUsed,
    lakeCapacity,
    catchmentArea,
  }
) {
  return pathFetch(getStationFixedPointUrl(Id), {
    name,
    measuringList,
    stationTypeId,
    mapLocation,
    position: position || undefined,
    address: address || undefined,
    note: note || undefined,
    qcvnId: qcvnId || undefined,
    provinceId: provinceId || null,
    website: website || undefined,
    yearOperate: yearOperate || undefined,
    userResponsible: userResponsible || undefined,
    userSupervisor: userSupervisor || undefined,
    phoneResponsible: phoneResponsible || undefined,
    phoneSupervisor: phoneSupervisor || undefined,
    irrigationArea: irrigationArea || undefined,
    purposeUsed: purposeUsed || undefined,
    lakeCapacity: lakeCapacity || undefined,
    catchmentArea: catchmentArea || undefined,
  })
}

export function getPoint(filter) {
  const url = getStationFixedPointUrl()
  return getFetch(url, filter)
}
export function importDataStationFixed(data) {
  return postFetch(getStationFixedPointUrl('import-data'), data)
}

export function getLastLog() {
  return getFetch(getStationFixedPointUrl('last-log'))
}

export default {
  getStationFixedPoints,
  getStationFixedPoint,
  createStationFixedPoint,
  deleteStationFixedPoint,
  updateStationFixedPoint,
  deactivateStationFixedPoint,
  activeStationFixedPoint,
  getLastLog,
}
