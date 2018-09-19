import { getConfigApi } from 'config'
import { deleteFetch, getFetch, postFetch, putFetch } from 'utils/fetch'

function getQCVNUrl(prefix = '') {
  return getConfigApi().qcvn + '/' + prefix
}

export function getQCVN(
  { page = 1, itemPerPage = 2 },
  { key = null, name = null } = {}
) {
  var urlSearch = `${getQCVNUrl()}?page=${page}&itemPerPage=${itemPerPage}`
  if (key) urlSearch += `&key=${key}`
  if (name) urlSearch += `&name=${name}`
  return getFetch(urlSearch)
  // return getFetch(getQCVNUrl()+`?itemPerPage=${itemPerPage}&page=${page}`)
}

export function getQCVNByID(_id) {
  return getFetch(getQCVNUrl(`${_id}`))
}

export function createQCVN(data = {}) {
  return postFetch(getQCVNUrl(), data)
}

export function deleteQCVN(_id) {
  return deleteFetch(getQCVNUrl(`${_id}`))
}

export function updateQCVN(_id, data = {}) {
  return putFetch(getQCVNUrl(`${_id}`), data)
}

export default {
  getQCVN,
  createQCVN,
  deleteQCVN,
  updateQCVN,
  getQCVNByID
}
