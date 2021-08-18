import { getLanguage } from 'utils/localStorage'
import { getConfigApi } from '../../config'
import {
  getFetch,
  postFetch,
  deleteFetch,
  pathFetch,
  getFetchDownFile,
} from 'utils/fetch'

export function getStationFixedUrl(prefix = '') {
  return getConfigApi().stationFixed + '/' + prefix
}

export function exportDataTemplate() {
  const lang = getLanguage()
  const url = getStationFixedUrl(
    `data-periodic-forecast/data-template?lang=${lang}`
  )
  return getFetchDownFile(url)
}

export function exportMonitoringPointTemplate(measurings = []) {
  const lang = getLanguage()
  const url =
    getStationFixedUrl('export-monitoring-point-template') + '/' + lang
  return getFetchDownFile(url, { measurings })
}

export async function getStationPeriodicForecast({
  page = 1,
  itemPerPage = 1000,
}) {
  let filter = {}
  if (page && itemPerPage) {
    filter = {
      skip: page - 1,
      limit: itemPerPage,
    }
  }

  let url = getStationFixedUrl('periodic-forecast')
  return getFetch(url, { filter })
}

export function getStationById(id) {
  let url = getStationFixedUrl(`periodic-forecast/${id}`)
  return getFetch(url)
}

export function createStation(data = {}) {
  let url = getStationFixedUrl('periodic-forecast')
  return postFetch(url, data)
}

export function deleteStation(Id) {
  return deleteFetch(getStationFixedUrl(`periodic-forecast/${Id}`))
}

export function deactivateStation(Id) {
  return pathFetch(getStationFixedUrl(`periodic-forecast/${Id}/deactivate`))
}
export function activeStation(Id) {
  return pathFetch(getStationFixedUrl(`periodic-forecast/${Id}/active`))
}

export function updateStation(id, data) {
  return pathFetch(getStationFixedUrl(`periodic-forecast/${id}`), data)
}

export function getPoint(filter) {
  const url = getStationFixedUrl()
  return getFetch(url, filter)
}
export function importDataStationFixed(data) {
  return postFetch(getStationFixedUrl('import-data'), data)
}

export function importStation(data) {
  return postFetch(getStationFixedUrl('data-periodic-forecast/import'), data)
}

export function getDataPeriodicForecast(params) {
  const url = getStationFixedUrl('data-periodic-forecast')
  return getFetch(url, params)
}

export function getLastLog() {
  return getFetch(getStationFixedUrl('last-log'))
}

export function updateConfig(id, data) {
  return pathFetch(getStationFixedUrl(`${id}/config`), data)
}

export function getImportHistory(params) {
  const url = getStationFixedUrl('import-history')
  return getFetch(url, params)
}

export default {
  getStationPeriodicForecast,
  getStationById,
  createStation,
  deleteStation,
  updateStation,
  deactivateStation,
  activeStation,
  importStation,
  getLastLog,
  updateConfig,
  exportDataTemplate,
  getImportHistory,
  getDataPeriodicForecast,
}
