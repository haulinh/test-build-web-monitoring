import { getConfigApi } from 'config'
import { getFetch, putFetch } from 'utils/fetch'

function getDataStationAutoUrl(prefix = '') {
  return getConfigApi().dataStationAuto + '/' + prefix
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

export function fetchListData(key, { from, to } = {}) {
  var url = getDataStationAutoUrl(`${key}/statistict?to=${to}&from=${from}`)
  return getFetch(url)
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
  fetchListData
}
