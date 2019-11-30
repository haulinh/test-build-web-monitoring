import { getConfigApi } from "config";
import { deleteFetch, getFetch, postFetch, putFetch } from "utils/fetch";

export function getMeasuringUrl(prefix = "") {
  return getConfigApi().measuring + "/" + prefix;
}

export function getStationTypeUrl(prefix = "") {
  if (prefix) return getConfigApi().stationType + "/" + prefix;
  return getConfigApi().stationType;
}

export function getMeasurings(
  { page = 1, itemPerPage = 10 },
  { unit = null, name = null }
) {
  var urlSearch = `${getMeasuringUrl()}?page=${page}&itemPerPage=${itemPerPage}`;
  if (unit) urlSearch += `&unit=${unit}`;
  if (name) urlSearch += `&name=${name}`;
  return getFetch(urlSearch);
}

export function getMeasuring(key) {
  return getFetch(getMeasuringUrl(key));
}

export function createMeasuring(measuring = {}) {
  return postFetch(getMeasuringUrl(), measuring);
}

export function updateMeasuring(key, measuring = {}) {
  return putFetch(getMeasuringUrl(key), measuring);
}

export function deleteMeasuring(key) {
  return deleteFetch(getMeasuringUrl(key));
}

export function getStationTypes(
  { page = 1, itemPerPage = 10 },
  { key = null, name = null, isAuto = null } = {}
) {
  const params = { itemPerPage, page };
  if (isAuto !== null) params.isAuto = isAuto;
  if (key) params.key = key;
  if (name) params.name = name;
  // if (key) urlSearch += `&key=${key}`
  // if (name) urlSearch += `&name=${name}`

  return getFetch(getStationTypeUrl(), undefined, { params });
}

export function getStationType(key) {
  return getFetch(getStationTypeUrl(key));
}

export function createStationType(measuring = {}) {
  return postFetch(getStationTypeUrl(), measuring);
}

export function updateStationType(key, measuring = {}) {
  return putFetch(getStationTypeUrl(key), measuring);
}

export function deleteStationType(key) {
  return deleteFetch(getStationTypeUrl(key));
}

/* #region  NOTE  cấu hình QAQC */

export function getConfigSysUrl(prefix = null) {
  if (prefix) return getConfigApi().qaqcConfig + "/" + prefix;
  return getConfigApi().qaqcConfig;
}

export function getConfigQAQC() {
  return getFetch(getConfigSysUrl());
}
export function postConfigQAQC(data) {
  return postFetch(getConfigSysUrl(), data);
}

export function putConfigQAQC(key, data) {
  return putFetch(getConfigSysUrl(key), data);
}

/* #endregion */

/* #region  NOTE  cấu hình AQI-Calculation */

export function getConfigAqiCalculation() {
  return getFetch(getConfigApi().aqiConfigCalculation);
}

export function postConfigAqiCalculation(data) {
  return postFetch(getConfigApi().aqiConfigCalculation, data);
}

/* #endregion */

/* #region  NOTE  cấu hình AQI-QC */

export function getConfigAqiQC() {
  return getFetch(getConfigApi().aqiConfigQC);
}

export function postConfigAqiQC(data) {
  return postFetch(getConfigApi().aqiConfigQC, data);
}

/* #endregion */

/* --------------------------- [ START ] config route on category service --------------------------- */

function getConfigs(config) {
  return getConfigApi().config + '/' + config
}

export function getWarningLevelColor() {
  const url = getConfigs('color-station')
  return getFetch(url)
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
  getConfigAqiCalculation,
  getConfigAqiQC,
  postConfigAqiQC,
  getWarningLevelColor
};
