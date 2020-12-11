import { getConfigApi } from '../../config'
import { deleteFetch, getFetch, pathFetch, postFetch } from '../../utils/fetch'

const getStationFixedPhaseUrl = (prefix = '') => {
  return getConfigApi().stationFixedDataPoint + '/' + prefix
}

export const getDataPoint = (queryParam) => {
  const url = getStationFixedPhaseUrl()
  return getFetch(url, queryParam)
}
