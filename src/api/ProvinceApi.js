import { getConfigApi } from '../config'
import { deleteFetch, getFetch, postFetch, putFetch } from 'utils/fetch'

function getProviceUrl(prefix = '') {
  return getConfigApi().province + '/' + prefix
}

export function getProvices(
  { page = 1, itemPerPage = 100 },
  { key = null, name = null } = {}
) {
  let urlSearch = `${getProviceUrl()}?page=${page}&itemPerPage=${itemPerPage}`
  if (key) urlSearch += `&key=${key}`
  if (name) urlSearch += `&name=${name}`
  return getFetch(urlSearch)
  // return getFetch(getProviceUrl()+`?itemPerPage=${itemPerPage}&page=${page}`)
}

export function getProviceByID(_id) {
  return getFetch(getProviceUrl(`${_id}`))
}

export function createProvince(data = {}) {
  return postFetch(getProviceUrl(), data)
}

export function deleteProvince(_id) {
  return deleteFetch(getProviceUrl(`${_id}`))
}

export function updateProvince(_id, data = {}) {
  return putFetch(getProviceUrl(`${_id}`), data)
}

export default {
  getProvices,
  createProvince,
  deleteProvince,
  updateProvince,
  getProviceByID,
}
