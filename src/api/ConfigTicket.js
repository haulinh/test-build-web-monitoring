import { getFetch, pathFetch } from 'utils/fetch'
import { getConfigApi } from '../config'

export function getConfigTicketURl(prefix = '') {
  return getConfigApi().config + '/' + prefix
}

export function getConfigTicket() {
  let url = getConfigTicketURl('ticket')
  return getFetch(url)
}

export function updateConfigTicket(params) {
  return pathFetch(getConfigTicketURl('ticket'), params)
}

export default {
  getConfigTicket,
  updateConfigTicket,
}
