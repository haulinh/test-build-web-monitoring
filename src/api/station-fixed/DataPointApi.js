import { getConfigApi } from '../../config'
import { getFetch, getFetchDownFile } from '../../utils/fetch'

// Api Data Point
const getDataPointUrl = (prefix = '') => {
  return getConfigApi().stationFixedDataPoint + '/' + prefix
}

const getStationFixedUrl = (prefix = '') => {
  return getConfigApi().stationFixed + '/' + prefix
}

export const getDataPoint = queryParam => {
  const url = getDataPointUrl()
  return getFetch(url, queryParam)
}

export const getDataStations = queryParam => {
  const url = getStationFixedUrl('data-stations')
  return getFetch(url, queryParam)
}

export const exportExcelDataStations = (lang, queryParam) => {
  const url = getStationFixedUrl(`export-data-stations/${lang}`)
  return getFetchDownFile(url, queryParam)
}

// Api Data Point export Excel
const getExportDataPointUrl = (prefix = '') => {
  return getConfigApi().stationFixedExportDataPoint + '/' + prefix
}
export const exportDataPoint = (lang, queryParam) => {
  const url = getExportDataPointUrl(lang)
  return getFetchDownFile(url, queryParam)
}
