import { getConfigApi } from '../config'
import { getFetch, putFetch } from 'utils/fetch'

export function getSubscription() {
  let urlFetch = getConfigApi().organization + '/subscription/status'
  return getFetch(urlFetch)
}

export function updateOrganizationNameLogo(organization) {
  let url = getConfigApi().organization + `/nameLogo/${organization._id}`
  return putFetch(url, organization)
}

export default {
  getSubscription,
  updateOrganizationNameLogo
}
