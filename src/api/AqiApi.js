import { getConfigApi } from '../config'
import { getFetch } from 'utils/fetch'

function getAqiUrl(prefix = '') {
  return getConfigApi().aqi + '/' + prefix
}
function getAqiV1Url(prefix = '') {
  return getConfigApi().aqi_v1 + '/' + prefix
}

export function fetchAqiByHour() {
  return getFetch(getAqiUrl('AIR_QUALITY/hour-last-logs'))
}

export function fetchAqiByDay(key, params = {}) {
  return getFetch(getAqiUrl(`${key}/aqi-day-last-logs`), undefined, { params })
}

export function fetchAqiHistory(key, { from, to, type } = {}) {
  var url = getAqiUrl(`${key}/histories-statistics?to=${to}&from=${from}`)
  if(type) url += `&type=${type}`
  return getFetch(url)
}
export function exportFileHistory(key, { from, to } = {}) {
  var url = getAqiUrl(`${key}/export-data?to=${to}&from=${from}`)
  return getFetch(url)
}

export function fetchAqiDaybyListStation({ from, to, listKey, timezoneDay } = {}) {
  var url = getAqiV1Url(`aqi-day?to=${to}&from=${from}&listKey=${listKey}&timezoneDay=${timezoneDay}`)
  return getFetch(url)
}

export function exportFileAqiDaybyListStation({ from, to, listKey, timezoneDay } = {}) {
  var url = getAqiV1Url(`aqi-day-export-data?from=${from}&to=${to}&listKey=${listKey}&timezoneDay=${timezoneDay}`)
  return getFetch(url)
}

export function fetchAqiHourbyStation({ from, to, listKey } = {}) {
  var url = getAqiV1Url(`aqi-hour?to=${to}&from=${from}&listKey=${listKey}`)
  return getFetch(url)
}

export function exportFileAqiHourbyStation( { from, to, listKey  } = {}) {
  var url = getAqiV1Url(`aqi-hour-export-data?to=${to}&from=${from}&listKey=${listKey}`)
  return getFetch(url)
}

export default {
  fetchAqiByHour,
  fetchAqiByDay,
  fetchAqiHistory,
  exportFileHistory,
  fetchAqiDaybyListStation,
  exportFileAqiDaybyListStation,
  fetchAqiHourbyStation,
  exportFileAqiHourbyStation
}
