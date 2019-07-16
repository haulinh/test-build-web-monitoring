import { getConfigApi } from 'config'
import { getFetch, putFetch } from 'utils/fetch'

function getDataStationAutoUrl(prefix = '') {
  return getConfigApi().dataStationAuto + '/' + prefix
}

function getReportUrl(prefix = '') {
  return getConfigApi().report + '/' + prefix
}

export function getDataStationAutos(
  { page = 1, itemPerPage = 10 },
  { fromDate, toDate, key, advanced, measuringList, isExceeded, dataType }
) {
  var url = `${getDataStationAutoUrl(
    `${key}?page=${page}&itemPerPage=${itemPerPage}`
  )}`
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (advanced) url += `&advanced=${JSON.stringify(advanced)}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (isExceeded) url += `&isExceeded=${isExceeded}`
  if (dataType) url += `&dataType=${dataType}`
  return getFetch(url)
}

export function getExportData({
  fromDate,
  toDate,
  key,
  advanced,
  measuringList,
  isExceeded,
  dataType,
  name
}) {
  var url = getDataStationAutoUrl(`${key}/export-download?`)
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (advanced) url += `&advanced=${JSON.stringify(advanced)}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (isExceeded) url += `&isExceeded=${isExceeded}`
  if (dataType) url += `&dataType=${dataType}`
  if (name) url += `&name=${name}`
  return getFetch(url)
  //window.location = url
}

export function getDataStationAutoAvg(
  { page = 1, itemPerPage = 10 },
  { fromDate, toDate, key, measuringList, type }
) {
  var url = getDataStationAutoUrl(
    `${key}/avg?page=${page}&itemPerPage=${itemPerPage}`
  )
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (type) url += `&type=${type}`
  return getFetch(url)
}

export function getDataStationAutoExportAvg({
  fromDate,
  toDate,
  key,
  measuringList,
  type,
  name
}) {
  var url = getDataStationAutoUrl(`${key}/export-avg?`)
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (type) url += `&type=${type}`
  if (name) url += `&name=${name}`
  return getFetch(url)
}

export function getDataAnalyzeStationAutos({
  fromDate,
  toDate,
  key,
  advanced,
  measuringList,
  isExceeded,
  dataType
}) {
  var url = getDataStationAutoUrl(`${key}/analyze?`)
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (advanced) url += `&advanced=${JSON.stringify(advanced)}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (isExceeded) url += `&isExceeded=${isExceeded}`
  if (dataType) url += `&dataType=${dataType}`
  return getFetch(url)
}

export const getDataStationAutoRatioCount = (to, from) => {
  return getFetch(getDataStationAutoUrl('vas/count-station'), undefined, {
    params: { from, to }
  })
}

export const getCountStatusFtpTranfer = () => {
  const url = getDataStationAutoUrl('ftp-tranfer/count')
  return getFetch(url)
}

export const getHistoryFtpTranfer = key => {
  const url = getDataStationAutoUrl(`${key}/ftp-tranfer/history`)
  return getFetch(url)
}

export const putDataFtpTranfer = params => {
  return putFetch(getDataStationAutoUrl('ftp-tranfer/put-data'), params)
}

export function fetchDataStatistict(key, { from, to, dataFrequency } = {}) {
  var url = getDataStationAutoUrl(
    `${key}/statistict?to=${to}&from=${from}&dataFrequency=${dataFrequency}`
  )
  return getFetch(url)
}

export function exportDataStatistict(
  key,
  { from, to, dataFrequency, stationName } = {}
) {
  var url = getDataStationAutoUrl(
    `${key}/export-statistict?to=${to}&from=${from}&dataFrequency=${dataFrequency}&stationName=${stationName}`
  )
  return getFetch(url)
}

export function getDataStatistictExceeded(
  key,
  { from, to, measuringList } = {}
) {
  var url = getDataStationAutoUrl(
    `${key}/exceeded-statistict?to=${to}&from=${from}&measuringList=${measuringList.join(
      ','
    )}`
  )
  return getFetch(url)
}

export function exportStatistictExceeded(key, data) {
  var url = getDataStationAutoUrl(`${key}/export-exceeded`)
  return putFetch(url, data)
}

export function getUrlReportType1(token, key, time, measuringListStr, measuringListUnitStr) {
  var url = getReportUrl(`type1/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`)
  return url
}

export function getUrlReportType2(token, key, time, measuringListStr, measuringListUnitStr) {
  var url = getReportUrl(`type2/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`)
  return url
}

export function getUrlReportType3(token, key, time, measuringListStr, measuringListUnitStr) {
  var url = getReportUrl(`type3/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`)
  return url
}

export function getUrlReportType4(token, key, time, measuringListStr, measuringListUnitStr) {
  var url = getReportUrl(`type4/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`)
  return url
}

export function getUrlReportType5(token, key, time, measuringListStr, measuringListUnitStr) {
  var url = getReportUrl(`type5/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`)
  return url
}

export function getUrlReportType6(token, key, time, measuringListStr, measuringListUnitStr) {
  var url = getReportUrl(`type6/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`)
  return url
}

export default {
  getDataStationAutos,
  getExportData,
  getDataStationAutoAvg,
  getDataStationAutoExportAvg,
  getDataAnalyzeStationAutos,
  getDataStationAutoRatioCount,
  getCountStatusFtpTranfer,
  getHistoryFtpTranfer,
  putDataFtpTranfer,
  fetchDataStatistict,
  exportDataStatistict,
  getDataStatistictExceeded,
  exportStatistictExceeded,
  getUrlReportType1,
  getUrlReportType2,
  getUrlReportType3,
  getUrlReportType4,
  getUrlReportType5,
  getUrlReportType6,
}
