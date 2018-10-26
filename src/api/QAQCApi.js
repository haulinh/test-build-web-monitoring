import { getConfigApi } from 'config'
import { getFetch, putFetch, deleteFetch } from 'utils/fetch'
import { pick, get, join } from 'lodash'

const getDataStationAutoUrl = (prefix = '') => {
  // return getConfigApi().dataStationAuto + '/' + prefix
  return 'http://localhost:5004/data-station-auto/' + prefix
}

const toParams = params => {
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
  return params
}

export const fetchData = (
  pagination = { page: 1, itemPerPage: 10 },
  params = {}
) => {
  params = toParams(params)

  // return getFetch(getDataStationAutoUrl(`${get(params, 'key', 'vas')}/qa-qc`), undefined, {params: {...params, ...pagination}})
  return getFetch(
    getDataStationAutoUrl(`${get(params, 'key', 'vas')}/qa-qc`),
    undefined,
    { params: { ...params, ...pagination } }
  )
}

export const putData = (params, dataUpdate) => {
  params = toParams(params)
  //const url = `http://localhost:5004/data-station-auto/${get(params, 'key', 'vas')}/qa-qc`
  // return getFetch(getDataStationAutoUrl(`${get(params, 'key', 'vas')}/qa-qc`), undefined, {params: {...params, ...pagination}})
  return putFetch(
    getDataStationAutoUrl(`${get(params, 'key', 'vas')}/qa-qc`),
    //url,
    dataUpdate,
    { params: { ...params } }
  )
}

export const deleteData = (params, data) => {
  params = toParams(params)
  //const url = `http://localhost:5004/data-station-auto/${get(params, 'key', 'vas')}/qa-qc`
  // return getFetch(getDataStationAutoUrl(`${get(params, 'key', 'vas')}/qa-qc`), undefined, {params: {...params, ...pagination}})
  return deleteFetch(
    getDataStationAutoUrl(`${get(params, 'key', 'vas')}/qa-qc`),
    //url,
    undefined,
    { params: { ...params }, data }
  )
}

export default {
  fetchData,
  putData,
  deleteData
}
