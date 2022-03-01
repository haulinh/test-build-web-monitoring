import { getConfigApi } from '../../config'
import { getFetch, postFetch, deleteFetch } from 'utils/fetch'

export function getStationFixedUrl(prefix = '') {
  return getConfigApi().stationFixed + '/' + prefix
}

export function getImportHistory(params) {
  const url = getStationFixedUrl('import-history')
  return getFetch(url, params)
}

export function uploadDriver(data) {
  const url = getStationFixedUrl('import-history/upload-file')
  return postFetch(url, data)
}

export function deleteById(id) {
  const url = getStationFixedUrl(`import-history/${id}`)
  return deleteFetch(url)
}

export default {
  getImportHistory,
  uploadDriver,
  deleteById,
}
