import { getConfigApi } from 'config'
import {
  deleteFetch,
  getFetch,
  postFetch,
  putFetch,
  pathFetch,
} from 'utils/fetch'

export function getMeasuringUrl(prefix = '') {
  return getConfigApi().measuring + '/' + prefix
}

export function getStationTypeUrl(prefix = '') {
  if (prefix) return getConfigApi().stationType + '/' + prefix
  return getConfigApi().stationType
}

export function getMeasurings(
  { page = 1, itemPerPage = 10 },
  { unit = null, name = null }
) {
  var urlSearch = `${getMeasuringUrl()}?page=${page}&itemPerPage=${itemPerPage}`
  if (unit) urlSearch += `&unit=${unit}`
  if (name) urlSearch += `&name=${name}`
  return getFetch(urlSearch)
}

export function getMeasuring(key) {
  return getFetch(getMeasuringUrl(key))
}

export function createMeasuring(measuring = {}) {
  return postFetch(getMeasuringUrl(), measuring)
}

export function updateMeasuring(key, measuring = {}) {
  return putFetch(getMeasuringUrl(key), measuring)
}

export function deleteMeasuring(key) {
  return deleteFetch(getMeasuringUrl(key))
}

export function getStationTypes(
  { page = 1, itemPerPage = 10 },
  { key = null, name = null, isAuto = null } = {}
) {
  const params = { itemPerPage, page }
  if (isAuto !== null) params.isAuto = isAuto
  if (key) params.key = key
  if (name) params.name = name
  // if (key) urlSearch += `&key=${key}`
  // if (name) urlSearch += `&name=${name}`

  return getFetch(getStationTypeUrl(), undefined, { params })
}

export function getStationType(key) {
  return getFetch(getStationTypeUrl(key))
}

export function createStationType(measuring = {}) {
  return postFetch(getStationTypeUrl(), measuring)
}

export function updateStationType(key, measuring = {}) {
  return putFetch(getStationTypeUrl(key), measuring)
}

export function deleteStationType(key) {
  return deleteFetch(getStationTypeUrl(key))
}

/* #region  NOTE  cấu hình QAQC */

export function getConfigSysUrl(prefix = null) {
  if (prefix) return getConfigApi().qaqcConfig + '/' + prefix
  return getConfigApi().qaqcConfig
}

export function getConfigQAQC() {
  return getFetch(getConfigSysUrl())
}
export function postConfigQAQC(data) {
  return postFetch(getConfigSysUrl(), data)
}

export function putConfigQAQC(key, data) {
  return putFetch(getConfigSysUrl(key), data)
}

export function toggleQaqcConfig(param) {
  return pathFetch(getConfigSysUrl(), param)
}

/* #endregion */
/* #region NOTE  aqi-list-config */
export function getListConfigAqi() {
  return getFetch(getConfigApi().aqiListConfig)
}

export function postListConfigAqi(data) {
  return postFetch(getConfigApi().aqiListConfig, data)
}
/* #endregion */

/* #region  NOTE  cấu hình AQI-Calculation  */

export function getConfigAqiCalculation(keyLevel = 'aqi-calculation-vn') {
  return getFetch(`${getConfigApi().aqiConfigCalculation}/${keyLevel}`)
}

export function postConfigAqiCalculation(
  keyLevel = 'aqi-calculation-vn',
  data
) {
  return postFetch(`${getConfigApi().aqiConfigCalculation}/${keyLevel}`, data)
}

/* #endregion */

/* #region  NOTE  cấu hình WQI-Calculation */

export function getListConfigWqi() {
  return getFetch(getConfigApi().wqiListConfig)
}

export function postListConfigWqi(data) {
  return postFetch(getConfigApi().wqiListConfig, data)
}

export function getConfigWqiCalculation(code) {
  return getFetch(getConfigApi().wqiConfigCalculation + `/${code}`)
}

export function postConfigWqiCalculation(code, data) {
  return postFetch(getConfigApi().wqiConfigCalculation + `/${code}`, data)
}

export function getConfigWqiWeight(code) {
  return getFetch(getConfigApi().wqiConfigWeight + `/${code}`)
}

export function postConfigWqiWeight(code, data) {
  return postFetch(getConfigApi().wqiConfigWeight + `/${code}`, data)
}

export function getConfigWqiParams(code) {
  return getFetch(getConfigApi().wqiConfigCalParams + `/${code}`)
}

export function postConfigWqiParams(code, data) {
  return postFetch(getConfigApi().wqiConfigCalParams + `/${code}`, data)
}

export function getConfigWqiMeaTable(code) {
  return getFetch(getConfigApi().wqiConfigMeaTable + `/${code}`)
}

export function postConfigWqiMeaTable(code, data) {
  return postFetch(getConfigApi().wqiConfigMeaTable + `/${code}`, data)
}

/* #endregion */

/* #region  NOTE  cấu hình AQI-QC */

export function getConfigAqiQC(keyQc = 'aqi-qc-vn') {
  return getFetch(`${getConfigApi().aqiConfigQC}/${keyQc}`)
}

export function postConfigAqiQC(keyQc = 'aqi-qc-vn', data) {
  return postFetch(`${getConfigApi().aqiConfigQC}/${keyQc}`, data)
}

/* #endregion */

/* --------------------------- [ START ] config route on category service --------------------------- */

function _getConfigs(config) {
  return getConfigApi().config + '/' + config
}

export function getWarningLevelColor() {
  const url = _getConfigs('color-config')
  return getFetch(url)
}

export function updateWarningLevelColorData(id, data) {
  const url = _getConfigs(`color-station/${id}`)
  return putFetch(url, data)
}

export function updateWarningLevelColorSensor(id, data) {
  const url = _getConfigs(`color-sensor/${id}`)
  return putFetch(url, data)
}

/* --------------------------- [ END ] config route on category service --------------------------- */

export default {
  getMeasurings,
  getMeasuring,
  createMeasuring,
  updateMeasuring,
  deleteMeasuring,
  getStationTypes,
  getStationType,
  createStationType,
  updateStationType,
  deleteStationType,
  getConfigQAQC,
  postConfigQAQC,
  putConfigQAQC,
  postConfigAqiCalculation,
  getListConfigAqi,
  postListConfigAqi,
  getConfigAqiCalculation,
  getConfigWqiMeaTable,
  postConfigWqiMeaTable,
  getConfigAqiQC,
  postConfigAqiQC,
  getWarningLevelColor,
  updateWarningLevelColorData,
  updateWarningLevelColorSensor,
  toggleQaqcConfig,
}
