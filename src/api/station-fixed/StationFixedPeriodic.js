import {
  getFetch,
  postFetch,
  deleteFetch,
  pathFetch,
  getFetchDownFile,
} from 'utils/fetch'
import { getLanguage } from 'utils/localStorage'
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

  const nameReplaced = (name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  filter = {
    ...filter,
    where: {
      name: nameReplaced ? { regexp: nameReplaced, options: 'i' } : undefined,
      stationTypeId,
      ...where,
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

export function deleteStationFixedPeriodic(id) {
  return deleteFetch(getStationFixedPeriodicUrl(id))
}

export function deactivateStationFixedPeriodic(id) {
  return pathFetch(getStationFixedPeriodicUrl(`${id}/deactivate`))
}

export function activeStationFixedPeriodic(id) {
  return pathFetch(getStationFixedPeriodicUrl(`${id}/active`))
}

export function updateStationFixedPeriodic(id, params) {
  return pathFetch(getStationFixedPeriodicUrl(id), params)
}

export function exportDataTemplateMonitoring(measurings = []) {
  const lang = getLanguage()
  const url = getStationFixedPeriodicUrl('export-data-template') + '/' + lang
  return getFetchDownFile(url, { lang, measurings })
}

export function exportSimpleDataTemplateMonitoring(measurings = []) {
  const lang = getLanguage()
  const url =
    getStationFixedPeriodicUrl('export-simple-data-template') + '/' + lang
  return getFetchDownFile(url, { lang, measurings })
}

export const importDataExcelMonitoring = params => {
  const url = getStationFixedPeriodicUrl('import-data')

  return postFetch(url, params)
}

export const importDataExcelMonitoringSimple = params => {
  const url = getStationFixedPeriodicUrl('import-simple-data')

  return postFetch(url, params)
}

export const importMultiplePoint = params => {
  const url = getStationFixedPeriodicUrl('import-multi-point')

  return postFetch(url, params)
}

export const exportStationFixedPointTemplate = () => {
  const lang = getLanguage()

  const url = getStationFixedPeriodicUrl(
    `export-monitoring-station-template/${lang}`
  )

  return getFetchDownFile(url)
}

export default {
  getStationFixedPeriodics,
  getStationFixedPeriodic,
  createStationFixedPeriodic,
  deleteStationFixedPeriodic,
  deactivateStationFixedPeriodic,
  activeStationFixedPeriodic,
  updateStationFixedPeriodic,
  exportDataTemplateMonitoring,
  exportSimpleDataTemplateMonitoring,
  exportStationFixedPointTemplate,
  importDataExcelMonitoring,
  importDataExcelMonitoringSimple,
  importMultiplePoint,
}
