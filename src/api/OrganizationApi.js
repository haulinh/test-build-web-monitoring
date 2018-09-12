import { getConfigApi } from '../config'
import { getFetch, putFetch } from 'utils/fetch'

export function getSubscription() {
  let urlFetch = getConfigApi().organization + '/subscription/status'
  return getFetch(urlFetch)
}

export function updateOrganization(organization){
  let url = getConfigApi().organization + `/${organization._id}`
  return putFetch(url, organization)
}

export default {
  getSubscription,
  updateOrganization
}
