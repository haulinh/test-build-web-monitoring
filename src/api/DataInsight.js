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
    const url = getDataInsightUrl('analyze-data')
    return getFetch(url, params)
  },
  exportDataInsight: (params, lang) => {
    const url = getDataInsightUrl(`export-analyze/${lang}`)
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
  getDataRatio: (type, param) => {
    const url = getDataInsightUrl(`report/data-ratio/${type}`)
    return getFetch(url, param)
  },
  exportDataRatio: (type, param) => {
    const url = getDataInsightUrl(`report/data-ratio/${type}/export`)
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
  exportDataAverage: (stationKey, params) => {
    const url = getDataInsightUrl(`report/data-average/${stationKey}/export`)
    return getFetchDownFile(url, params)
  },
  //#endregion
}
