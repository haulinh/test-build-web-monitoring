import { getConfigApi } from 'config'
import { getFetch } from 'utils/fetch'

function getDataInsightUrl(prefix = '') {
  return [getConfigApi().dataInsight, prefix].filter(item => item).join('/')
}

export default {
  getDataInsight: params => {
    const url = getDataInsightUrl('data-insight')
    return getFetch(url, params)
  },
}
