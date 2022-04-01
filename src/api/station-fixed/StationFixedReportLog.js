import { deleteFetch, postFetch, pathFetch } from 'utils/fetch'
import { getConfigApi } from '../../config'

export function getStationFixedReportLogUrl(prefix = '') {
  return getConfigApi().stationFixedReportLog + '/' + prefix
}

export function deleteStationFixedReportLog(params) {
  return deleteFetch(
    getStationFixedReportLogUrl(`${params.reportId}?logId=${params.logId}`)
  )
}

export const createStationFixedReportLog = params => {
  let url = getStationFixedReportLogUrl()
  return postFetch(url, params)
}

export const updateStationFixedReportLog = (reportId, logId, params) => {
  let url = getStationFixedReportLogUrl(`${reportId}?logId=${logId}`)
  return pathFetch(url, params)
}

export default {
  deleteStationFixedReportLog,
  createStationFixedReportLog,
  updateStationFixedReportLog,
}
