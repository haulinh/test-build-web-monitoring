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
const SLUG_WQI_VS = 'v1'
export function fetchWQILastLogs({ listKey, code = 'vi' } = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/hour-last-logs?listKey=${listKey}&code=${code}`
  )
  return getFetch(url)
}
export function fetchWqiHourbyStation({ from, to, listKey, code } = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/hour?to=${to}&from=${from}&listKey=${listKey}&code=${code}`
  )
  return getFetch(url)
}

export function fetchWQIProcessCalDay({ from, to, listKey, code } = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/process-cal-day?to=${to}&from=${from}&listKey=${listKey}&code=${code}`
  )
  return getFetch(url)
}
export function fetchWQIProcessCalHour({ from, to, listKey, code } = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/process-cal-hour?to=${to}&from=${from}&stationKey=${listKey}&code=${code}`
  )
  return getFetch(url)
}

export function exportFileWqiHourbyStation({
  from,
  to,
  listKey,
  code,
  language = 'EN',
} = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/hour-export-excel?to=${to}&from=${from}&listKey=${listKey}&code=${code}&language=${language}`
  )
  return getFetch(url)
}
export function exportFileWqiDaybyListStation({
  from,
  to,
  listKey,
  code,
  language = 'EN',
} = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/day-export-excel?from=${from}&to=${to}&listKey=${listKey}&code=${code}&language=${language}`
  )
  return getFetch(url)
}

export function fetchWqiDaybyListStation({ from, to, listKey, code } = {}) {
  var url = getWqiUrl(
    `${SLUG_WQI_VS}/day?to=${to}&from=${from}&listKey=${listKey}&code=${code}`
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
  exportFileWqiHourbyStation,
  fetchWqiDaybyListStation,
  exportFileWqiDaybyListStation,
}
