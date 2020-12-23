import { getConfigApi } from '../../config'
import { getFetch, getFetchDownFile } from '../../utils/fetch'

// Api Data Point
const getDataPointUrl = (prefix = '') => {
  return getConfigApi().stationFixedDataPoint + '/' + prefix
}
export const getDataPoint = queryParam => {
  const url = getDataPointUrl()
  return getFetch(url, queryParam)
}

// Api Data Point export Excel
const getExportDataPointUrl = (prefix = '') => {
  return getConfigApi().stationFixedExportDataPoint + '/' + prefix
}
export const exportDataPoint = (lang, queryParam) => {
  const url = getExportDataPointUrl(lang)
  return getFetchDownFile(url, queryParam)
}