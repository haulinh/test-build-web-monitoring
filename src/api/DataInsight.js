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
}
