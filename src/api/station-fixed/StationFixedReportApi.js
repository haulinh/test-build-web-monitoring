import { getFetch } from 'utils/fetch'
import { getConfigApi } from '../../config'

export function getStationFixedReportUrl(prefix = '') {
  return getConfigApi().stationFixedReport + '/' + prefix
}

export async function getStationFixedReports(params) {
  let url = getStationFixedReportUrl()
  return getFetch(url, params)
}

export function getStationFixedReport(id) {
  let url = getStationFixedReportUrl(id)
  return getFetch(url)
}

export default {
  getStationFixedReports,
  getStationFixedReport,
}
