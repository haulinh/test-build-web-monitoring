import { getConfigApi } from 'config'
import { getFetch, getFetchDownFile } from 'utils/fetch'

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
  }
}
