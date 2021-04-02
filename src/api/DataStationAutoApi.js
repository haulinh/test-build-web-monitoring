import { getConfigApi } from 'config'
import { getFetch, putFetch, postFetch } from 'utils/fetch'
import qs from 'query-string'
import { upperCase as _upperCase } from 'lodash'


export function getDataStationAutoUrl(prefix = '') {
  return getConfigApi().dataStationAuto + '/' + prefix
}

export function getHistoricalDataUrl(prefix = '') {
  // console.log(process.env, '=process.env.isDev')

  // return 'http://localhost:5022/historical-data' + '/' + prefix
  return getConfigApi().dataInsight + '/historical-data/' + prefix
}
export function getAvgDataUrl(prefix = '') {
  // console.log(process.env, '=process.env.isDev')

  // return 'http://localhost:5022/data-avg' + '/' + prefix
  return getConfigApi().dataInsight + '/data-avg/' + prefix
}

function getReportUrl(prefix = '') {
  return getConfigApi().report + '/' + prefix
}

export function getDataStationAutos(
  { page = 1, itemPerPage = 10 },
  { fromDate, toDate, key, advanced, measuringList, isExceeded, dataType, qcvnList, isFilter, queryType }
) {
  // console.log()
  var url = `${getHistoricalDataUrl(
    `${key}?page=${page}&itemPerPage=${itemPerPage}`
  )}`
  // console.log(url, '==url')
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (advanced) url += `&advanced=${JSON.stringify(advanced)}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (isExceeded) url += `&isExceeded=${isExceeded}`
  if (dataType) url += `&dataType=${dataType}`
  if (qcvnList) url += `&qcvnList=${qcvnList}`
  if (isFilter) url += `&isFilter=${isFilter}`
  if (queryType) url += `&queryType=${queryType}`
  return getFetch(url)
}

export function getExportData({
  fromDate,
  toDate,
  key,
  advanced,
  measuringList,
  measuringListUnitStr,
  isExceeded,
  dataType,
  name,
  language,
  qcvnList,
  queryType,
  isFilter,
}) {
  // var url = getDataStationAutoUrl(`${key}/export-download?`)
  var url = getHistoricalDataUrl(`${key}/export-download?`)

  // console.log(url, '==url==')
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (advanced) url += `&advanced=${JSON.stringify(advanced)}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (measuringListUnitStr)
    url += `&measuringListUnit=${measuringListUnitStr.join(',')}`
  if (isExceeded) url += `&isExceeded=${isExceeded}`
  if (dataType) url += `&dataType=${dataType}`
  if (name) url += `&name=${name}`
  if (language) url += `&language=${_upperCase(language)}`
  if (qcvnList) url += `&qcvnList=${qcvnList}`
  if (queryType) url += `&queryType=${queryType}`
  if (isFilter) url += `&isFilter=${isFilter}`
  return getFetch(url)
  //window.location = url
}

export function getDataStationAutoAvg(
  { page = 1, itemPerPage = 10 },
  { fromDate, toDate, key, measuringList, type, advanced, dataStatus }
) {
  var url = getDataStationAutoUrl(
    `${key}/avg?page=${page}&itemPerPage=${itemPerPage}`
  )
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (advanced && advanced.length)
    url += `&advanced=${JSON.stringify(advanced)}`
  if (dataStatus && dataStatus.length)
    url += `&dataStatus=${dataStatus.join(',')}`
  if (type) url += `&type=${type}`
  return getFetch(url)
}

export function getDataStationAutoAvg_v2(
  { page = 1, itemPerPage = 10 },
  { fromDate, toDate, key, measuringList, type, advanced, dataStatus, isFilter }
) {
  var url = getAvgDataUrl(
    `${key}/avg-advanced?page=${page}&itemPerPage=${itemPerPage}`
  )
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (advanced && advanced.length)
    url += `&advanced=${JSON.stringify(advanced)}`
  if (dataStatus && dataStatus.length)
    url += `&dataStatus=${dataStatus.join(',')}`
  if (type) url += `&type=${type}`
  if (isFilter) url += `&isFilter=${isFilter}`
  return getFetch(url)
}

export function getDataStationAutoExportAvg({
  fromDate,
  toDate,
  key,
  measuringList,
  measuringListUnitStr,
  type,
  name,
  advanced,
  dataStatus,
  language,
  isFilter
}) {
  console.log("isFilter" + isFilter)
  var url = getAvgDataUrl(`${key}/export-avg?`)
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (measuringListUnitStr)
    url += `&measuringListUnit=${measuringListUnitStr.join(',')}`
  if (advanced && advanced.length)
    url += `&advanced=${JSON.stringify(advanced)}`
  if (dataStatus && dataStatus.length)
    url += `&dataStatus=${dataStatus.join(',')}`

  if (type) url += `&type=${type}`
  if (name) url += `&name=${name}`
  if (language) url += `&language=${_upperCase(language)}`
  if (isFilter) url += `&isFilter=${isFilter}`
  console.log(url, '==url==')
  return getFetch(url)
}

export function exportExcelMultipleStation(data) {
  var url = getDataStationAutoUrl(`/export-avg-multiple-station?`)
  console.log(data, '------data')
  return postFetch(url, data)
}

export function downloadExcel_DataStationAutov1(
  token,
  {
    fromDate,
    toDate,
    key,
    measuringList,
    measuringListUnitStr,
    type,
    language = 'EN',
  }
) {
  let url = getDataStationAutoUrl(`${key}/export-avg-v1?token=${token}`)
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (language) url += `&language=${_upperCase(language)}`
  if (measuringListUnitStr)
    url += `&measuringListUnit=${measuringListUnitStr.join(',')}`
  if (type) url += `&type=${type}`
  return url
}

export function getDataAnalyzeStationAutos({
  fromDate,
  toDate,
  key,
  advanced,
  measuringList,
  isExceeded,
  dataType,
  isFilter,
  queryType,
  qcvnList
}) {
  // console.log("ANAnlyze ata " + isFilter)
  var url = getHistoricalDataUrl(`${key}/analyze?`)
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (advanced) url += `&advanced=${JSON.stringify(advanced)}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (isExceeded) url += `&isExceeded=${isExceeded}`
  if (dataType) url += `&dataType=${dataType}`
  if (isFilter) url += `&isFilter=${isFilter}`
  if (queryType) url += `&queryType=${queryType}`
  if (qcvnList) url += `&qcvnList=${qcvnList}`
  return getFetch(url)
}

export const getDataStationAutoRatioCount = (to, from) => {
  return getFetch(getDataStationAutoUrl('vas/count-station'), undefined, {
    params: { from, to },
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

export function getUrlReportType1(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(
    `type1/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`
  )
  return url
}

export function getUrlReportType3(
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(`type3/${key}?1=1`)
  if (time) url += `&time=${time}`
  if (measuringListStr) url += `&measuringList=${measuringListStr}`
  if (measuringListUnitStr) url += `&measuringListUnit=${measuringListUnitStr}`
  return getFetch(url)
}

export function getUrlReportType3Excel(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr,
  language = 'EN'
) {
  var url = getReportUrl(
    `type3-excel/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}&language=${language}`
  )
  return url
}

export function getUrlReportType4(
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(`type4/${key}?1=1`)
  if (time) url += `&time=${time}`
  if (measuringListStr) url += `&measuringList=${measuringListStr}`
  if (measuringListUnitStr) url += `&measuringListUnit=${measuringListUnitStr}`
  return getFetch(url)
}

export function getUrlReportType4Excel(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr,
  language = 'EN'
) {
  var url = getReportUrl(
    `type4-excel/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}&language=${language}`
  )
  return url
}

export function getUrlReportType5(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(
    `type5/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`
  )
  return url
}

export function getUrlReportType6(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(
    `type6/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`
  )
  return url
}

export function getUrlReportType7(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(
    `type7/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`
  )
  return url
}

export function getUrlReportType8(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(
    `type8/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`
  )
  return url
}

export function getUrlReportType9(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(
    `type9/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`
  )
  return url
}

export function getUrlReportType10({ stationType, fromDate, toDate }) {
  var url = getReportUrl(`type10?1=1`)
  if (stationType) url += `&stationTypeId=${stationType}`
  if (fromDate) url += `&fromDate=${fromDate}`
  if (toDate) url += `&toDate=${toDate}`
  // console.log(url,"url")
  return getFetch(url)
}

export function getUrlReportType10Excel({
  stationType,
  fromDate,
  toDate,
  language = 'EN',
}) {
  var url = getReportUrl(`type10-excel?1=1`)
  if (stationType) url += `&stationTypeId=${stationType}`
  if (fromDate) url += `&fromDate=${fromDate}`
  if (toDate) url += `&toDate=${toDate}`
  if (language) url += `&language=${_upperCase(language)}`
  // console.log(url,"url")
  return getFetch(url)
}

export function getUrlReportType2Excel(
  token,
  key,
  time,
  measuringListStr,
  measuringListUnitStr,
  language = 'EN'
) {
  var url = getReportUrl(
    `type2-excel/${key}?token=${token}&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}&language=${_upperCase(
      language
    )}`
  )
  return url
}

export function getUrlReportType2(
  key,
  time,
  measuringListStr,
  measuringListUnitStr
) {
  var url = getReportUrl(`type2/${key}?1=1`)
  if (time) url += `&time=${time}`
  if (measuringListStr) url += `&measuringList=${measuringListStr}`
  if (measuringListUnitStr) url += `&measuringListUnit=${measuringListUnitStr}`

  // var url = getReportUrl(`type2/${key}?&time=${time}&measuringList=${measuringListStr}&measuringListUnit=${measuringListUnitStr}`)
  return getFetch(url)
}

export function getUrlReportType11({ key, fromDate, toDate, measuringList }) {
  var url = getReportUrl(`type11/${key}?1=1`)
  if (fromDate) url += `&fromDate=${fromDate}`
  if (toDate) url += `&toDate=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList}`
  // console.log(url,"url")
  return getFetch(url)
}

export function downloadExcel_reportType11(
  token,
  { key, fromDate, toDate, measuringList },
  language = 'EN'
) {
  let url = getReportUrl(
    `type11-excel/${key}/?token=${token}&language=${language}`
  )
  if (fromDate) url += `&fromDate=${fromDate}`
  if (toDate) url += `&toDate=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList}`
  return url
}

export function getUrlReportStatusData(stationKeys, from, to, language = 'EN') {
  const stringified = qs.stringify({
    from: from.toDate(),
    to: to.toDate(),
    listKey: stationKeys.join(','),
  })
  var url = getReportUrl(`assess-status?${stringified}&language=${language}`)
  return getFetch(url)
}

export function getUrlReportStatusDataExcel(
  token,
  stationKeys,
  from,
  to,
  language = 'EN'
) {
  const stringified = qs.stringify({
    token,
    from: from.toDate(),
    to: to.toDate(),
    listKey: stationKeys.join(','),
  })
  var url = getReportUrl(
    `assess-status-excel?${stringified}&language=${language}`
  )
  return url
}

export function searchStationAuto({
  stationType,
  provinceKey,
  dataStatus,
  standardKey,
  frequent,
  activatedAt,
  typeSampling,
  ...props
}) {
  let url = `${getDataStationAutoUrl(`station-key-custom?`)}`
  if (stationType && stationType !== 'ALL') url += `&stationType=${stationType}`
  if (provinceKey) url += `&provinceKey=${provinceKey}`
  if (dataStatus && dataStatus.length)
    url += `&dataStatus=${dataStatus.join(',')}`
  if (standardKey && standardKey.length)
    url += `&standardKey=${standardKey.join(',')}`
  if (frequent) url += `&frequent=${frequent}`
  if (activatedAt) url += `&activatedAt=${activatedAt}`
  if (typeSampling) url += `&typeSampling=${typeSampling}`
  return getFetch(url)
}

export default {
  getDataStationAutos,
  getExportData,
  getDataStationAutoAvg,
  getDataStationAutoAvg_v2,
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
  getUrlReportType2Excel,
  getUrlReportType3,
  getUrlReportType3Excel,
  getUrlReportType4,
  getUrlReportType5,
  getUrlReportType6,
  getUrlReportType7,
  getUrlReportType8,
  getUrlReportType9,
  getUrlReportType10,
  getUrlReportType10Excel,
  getUrlReportType11,
  downloadExcel_reportType11,
  downloadExcel_DataStationAutov1,
  getUrlReportStatusData,
  searchStationAuto,
}
