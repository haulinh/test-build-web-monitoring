import { getConfigApi } from 'config'
import { getFetch } from 'utils/fetch'

const SLUG = '/log'
function getUrl(path = '') {
  return getConfigApi().category + SLUG + '/' + path
}

export function getList({ page = 1, itemPerPage = 50 }, { email, from, to }) {
  let url = getUrl(`?itemPerPage=${itemPerPage}&page=${page}`)
  if (email) url += `&email=${email}`
  if (from && to) url += `&from=${from}&to=${to}`
  return getFetch(url)
}

export default {
  getList,
}
