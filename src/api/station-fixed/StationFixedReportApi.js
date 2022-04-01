import { getFetch, postFetch, pathFetch } from 'utils/fetch'
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

export const createManualReport = params => {
  let url = getStationFixedReportUrl()
  console.log({ url })

  return postFetch(url, params)
}

export const updateReportName = (id, name) => {
  let url = getStationFixedReportUrl(id)
  return pathFetch(url, { name })
}

export default {
  getStationFixedReports,
  getStationFixedReport,
  createManualReport,
  updateReportName,
}
