import { getConfigApi } from 'config'
import { getFetch } from 'utils/fetch'

const getDataStationAutoUrl = (prefix = '') => {
  return getConfigApi().dataStationAuto + '/' + prefix
}

export const fetchData = (
  { page = 1, itemPerPage = 10 },
  { key, fromDate, toDate, dataType, measuringList, stationAutoType }
) => {
  var url = `${getDataStationAutoUrl(
    `${key}/qa-qc?page=${page}&itemPerPage=${itemPerPage}`
  )}`
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (dataType) url += `&dataType=${dataType}`
  if (stationAutoType) url += `&stationAutoType=${stationAutoType}`
  return getFetch(url)
}

export function downloadExcel(
  token,
  { key, fromDate, toDate, dataType, measuringList, stationAutoType }
) {
  let url = getDataStationAutoUrl(`/${key}/qa-qc-excel/?token=${token}`)
  if (fromDate) url += `&from=${fromDate}`
  if (toDate) url += `&to=${toDate}`
  if (measuringList) url += `&measuringList=${measuringList.join(',')}`
  if (dataType) url += `&dataType=${dataType}`
  if (stationAutoType) url += `&stationAutoType=${stationAutoType}`
  return url
}

export default {
  fetchData,
  downloadExcel
}
