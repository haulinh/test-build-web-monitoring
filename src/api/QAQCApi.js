import { getConfigApi } from 'config'
import { getFetch } from 'utils/fetch'
import { pick, get, join } from 'lodash'

const getDataStationAutoUrl = (prefix = '') => {
  return getConfigApi().dataStationAuto + '/' + prefix
}

export const fetchData = (
  pagination = { page: 1, itemPerPage: 10 },
  params = {}
) => {
  params = pick(params, [
    'to',
    'from',
    'measuringList',
    'dataFilterBy',
    'dataType',
    'key'
  ])
  params.measuringList = join(get(params, 'measuringList', []), ',')
  params.dataFilterBy = join(get(params, 'dataFilterBy', []), ',')
  
  // return getFetch(getDataStationAutoUrl(`${get(params, 'key', 'vas')}/qa-qc`), undefined, {params: {...params, ...pagination}})
  return getFetch(
    getDataStationAutoUrl(`${get(params, 'key', 'vas')}/qa-qc`),
    undefined,
    { params: { ...params, ...pagination } }
  )
}

export default {
  fetchData
}
