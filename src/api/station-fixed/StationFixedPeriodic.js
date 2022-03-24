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

export function updateStationFixedPeriodic(
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
  return pathFetch(getStationFixedPeriodicUrl(Id), {
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

export default {
  getStationFixedPeriodics,
  getStationFixedPeriodic,
  createStationFixedPeriodic,
  deleteStationFixedPeriodic,
  deactivateStationFixedPeriodic,
  activeStationFixedPeriodic,
  updateStationFixedPeriodic,
}
