import { getConfigApi } from '../config'
import { getFetch } from 'utils/fetch'

// SURFACE_WATER
function getWqiUrl(prefix = '') {
  return getConfigApi().wqi + '/' + prefix
}

export function fetchWqi() {
  return getFetch(getWqiUrl('SURFACE_WATER/last-log'))
}

export function fetchWqiData(key, from) {
  return getFetch(getWqiUrl(`${key}/data-last-log/?time=${from}`))
}

export function fetchWqiHistory(key, { from, to } = {}) {
  var url = getWqiUrl(`${key}/histories-statistics?to=${to}&from=${from}`)
  return getFetch(url)
}

export function exportFileHistory(key, { from, to } = {}) {
  var url = getWqiUrl(`${key}/export-data?to=${to}&from=${from}`)
  return getFetch(url)
}

// NOTE 
const SLUG_WQI_VS ='v1'
export function fetchWQILastLogs({ listKey } = {}) {
  var url = getWqiUrl(`${SLUG_WQI_VS}/hour-last-logs?listKey=${listKey}`)
  return getFetch(url)
}
export function fetchWqiHourbyStation({ from, to, listKey } = {}) {
  var url = getWqiUrl(`${SLUG_WQI_VS}/hour?to=${to}&from=${from}&listKey=${listKey}`)
  return getFetch(url)
}

export function fetchWQIProcessCalDay({ from, to, listKey } = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/process-cal-day?to=${to}&from=${from}&stationKey=${listKey}`
  )
  return getFetch(url)
}
export function fetchWQIProcessCalHour({ from, to, listKey } = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/process-cal-hour?to=${to}&from=${from}&stationKey=${listKey}`
  )
  return getFetch(url)
}
export function exportFileWqiHourbyStation({ from, to, listKey } = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/hour-export-excel?to=${to}&from=${from}&listKey=${listKey}`
  )
  return getFetch(url)
}
export default {
  fetchWqi,
  fetchWqiData,
  fetchWqiHistory,
  exportFileHistory,
  fetchWQILastLogs,
  fetchWqiHourbyStation,
  fetchWQIProcessCalDay,
  fetchWQIProcessCalHour,
  exportFileWqiHourbyStation
}
