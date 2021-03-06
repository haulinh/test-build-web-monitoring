import { getConfigApi } from 'config'
import {
  deleteFetch,
  getFetch,
  getFetchDownFile,
  pathFetch,
  postFetch,
} from 'utils/fetch'

function getDataInsightUrl(prefix = '') {
  return [getConfigApi().dataInsight, prefix].filter(item => item).join('/')
}

export default {
  //#region data-search
  getDataInsight: params => {
    const url = getDataInsightUrl('report/data-analyze')
    return getFetch(url, params)
  },
  exportDataInsight: params => {
    const url = getDataInsightUrl(`report/data-analyze/export`)
    return getFetchDownFile(url, params)
  },
  getReceiveTime: params => {
    const url = getDataInsightUrl('get-receive-time')
    return getFetch(url, params)
  },
  //#endregion data-search

  //#region billing
  createConfigBilling: params => {
    const url = getDataInsightUrl('billing-config')
    return postFetch(url, params)
  },
  getConfigBilling: () => {
    const url = getDataInsightUrl('billing-config')
    return getFetch(url)
  },
  deleteConfigBilling: id => {
    const url = getDataInsightUrl(`billing-config/${id}`)
    return deleteFetch(url)
  },
  updateConfigBilling: (id, params) => {
    const url = getDataInsightUrl(`billing-config/${id}`)
    return pathFetch(url, params)
  },
  getConfigBillingById: id => {
    const url = getDataInsightUrl(`billing-config/${id}`)
    return getFetch(url)
  },
  //#endregion Billing

  //#region report
  getDataFlow: params => {
    const url = getDataInsightUrl(`report/data-flow`)
    return getFetch(url, params)
  },
  exportDataFlow: params => {
    const url = getDataInsightUrl(`report/data-flow/export`)
    return getFetchDownFile(url, params)
  },

  getExceedData: (type, param) => {
    const url = getDataInsightUrl(`report/data-exceed/${type}`)
    return getFetch(url, param)
  },
  getExportReportExceed: (type, params) => {
    const url = getDataInsightUrl(`report/data-exceed/${type}/export`)
    return getFetchDownFile(url, params)
  },
  getDataRatio: param => {
    const url = getDataInsightUrl(`report/data-ratio`)
    return getFetch(url, param)
  },
  exportDataRatio: param => {
    const url = getDataInsightUrl(`report/data-ratio/export`)
    return getFetchDownFile(url, param)
  },
  getDataOriginal: (stationKey, params) => {
    const url = getDataInsightUrl(`report/data-original/${stationKey}`)
    return getFetch(url, params)
  },
  exportDataOriginal: (stationKey, params) => {
    const url = getDataInsightUrl(`report/data-original/${stationKey}/export`)
    return getFetchDownFile(url, params)
  },
  getDataAverage: (stationKey, params) => {
    const url = getDataInsightUrl(`report/data-average/${stationKey}`)
    return getFetch(url, params)
  },
  getDataAverageOverview: params => {
    const url = getDataInsightUrl(`report/data-average`)
    return getFetch(url, params)
  },
  exportDataAverage: (stationKey, params) => {
    const url = getDataInsightUrl(`report/data-average/${stationKey}/export`)
    return getFetchDownFile(url, params)
  },
  exportDataAverageDetail: (stationKey, params) => {
    const url = getDataInsightUrl(
      `report/data-average/${stationKey}/export-detail`
    )
    return getFetchDownFile(url, params)
  },
  getDataAverageMax: (stationKey, params) => {
    const url = getDataInsightUrl(`report/data-average/${stationKey}/max`)
    return getFetch(url, params)
  },
  exportDataAverageMax: (stationKey, params) => {
    const url = getDataInsightUrl(
      `report/data-average/${stationKey}/export-max`
    )
    return getFetchDownFile(url, params)
  },
  //#endregion

  //#region data-status
  getReportStatusData: params => {
    const url = getDataInsightUrl('report/data-status')

    return getFetch(url, params)
  },

  exportExcelReportStatusData(params) {
    const url = getDataInsightUrl('report/data-status/export')

    return getFetchDownFile(url, params)
  },
  //#endregion data-status
}
