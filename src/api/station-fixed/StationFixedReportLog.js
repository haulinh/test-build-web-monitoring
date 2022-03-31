import { deleteFetch } from 'utils/fetch'
import { getConfigApi } from '../../config'

export function getStationFixedReportLogUrl(prefix = '') {
  return getConfigApi().stationFixedReportLog + '/' + prefix
}

export function deleteStationFixedReportLog(params) {
  return deleteFetch(
    getStationFixedReportLogUrl(`${params.reportId}?logId=${params.logId}`)
  )
}

export default {
  deleteStationFixedReportLog,
}
