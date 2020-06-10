import { getConfigApi } from '../config'
import { getFetch, putFetch, postFetch } from 'utils/fetch'

export function getSubscription() {
  let urlFetch = getConfigApi().organization + '/subscription/status'
  return getFetch(urlFetch)
}

export function getOrganization(_id) {
  let urlFetch = getConfigApi().organization + `/${_id}`
  return getFetch(urlFetch)
}

export function updateOrganizationNameLogo(organization) {
  let url = getConfigApi().organization + `/name-logo/${organization._id}`
  return putFetch(url, organization)
}

export function updateTransferFtpInfo(_id, data) {
  let url = getConfigApi().organization + `/transfer-ftp-info/${_id}`
  return putFetch(url, data)
}

export function createFilter(organizationId, data) {
  let url = getConfigApi().organization + `/configFilter/${organizationId}`
  return postFetch(url, data)
}

export default {
  getSubscription,
  updateOrganizationNameLogo,
  updateTransferFtpInfo,
  getOrganization,
  createFilter,
}
