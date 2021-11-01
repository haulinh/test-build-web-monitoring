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

export function exportSimpleDataTemplate(measurings = []) {
  const lang = getLanguage()
  const url =
    getStationFixedPointUrl('export-simple-data-template') + '/' + lang
  return getFetchDownFile(url, { measurings })
}

export function exportMonitoringPointTemplate(measurings = []) {
  const lang = getLanguage()
  const url =
    getStationFixedPointUrl('export-monitoring-point-template') + '/' + lang
  return getFetchDownFile(url, { measurings })
}

export async function getStationFixedPoints(
  { page = 1, itemPerPage = 1000 },
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
  const nameReplaced = (name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  filter = {
    ...filter,
    where: {
      name: nameReplaced ? { regexp: nameReplaced, options: 'i' } : undefined,
      stationTypeId,
      ...where,
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
    latVn2000,
    longVn2000,
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
    config,
  }
) {
  return pathFetch(getStationFixedPointUrl(Id), {
    name,
    measuringList,
    stationTypeId,
    mapLocation,
    latVn2000,
    longVn2000,
    position: position || null,
    address: address || null,
    note: note || null,
    qcvnId: qcvnId || null,
    provinceId: provinceId || null,
    website: website || null,
    yearOperate: yearOperate || null,
    userResponsible: userResponsible || null,
    userSupervisor: userSupervisor || null,
    phoneResponsible: phoneResponsible || null,
    phoneSupervisor: phoneSupervisor || null,
    irrigationArea: irrigationArea || null,
    purposeUsed: purposeUsed || null,
    lakeCapacity: lakeCapacity || null,
    catchmentArea: catchmentArea || null,
    config,
  })
}

export function getPoint(filter) {
  const url = getStationFixedPointUrl()
  return getFetch(url, filter)
}
export function importDataStationFixed(data) {
  return postFetch(getStationFixedPointUrl('import-data'), data)
}

export function importSimpleDataStationFixed(data) {
  return postFetch(getStationFixedPointUrl('import-data-simple'), data)
}

export function importMultiPoint(data) {
  return postFetch(getStationFixedPointUrl('import-multi-point'), data)
}

export function getLastLog() {
  return getFetch(getStationFixedPointUrl('last-log'))
}

export function updateConfig(id, data) {
  return pathFetch(getStationFixedPointUrl(`${id}/config`), data)
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
  updateConfig,
}
