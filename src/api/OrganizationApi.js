import { getConfigApi } from '../config'
import { getFetch, putFetch, postFetch, deleteFetch } from 'utils/fetch'

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

export function updateFilter(organizationId, filterId, data) {
  let url =
    getConfigApi().organization + `/configFilter/${organizationId}/${filterId}`
  return putFetch(url, data)
}

export function deleteFilter(organizationId, filterId) {
  let url =
    getConfigApi().organization + `/configFilter/${organizationId}/${filterId}`
  return deleteFetch(url)
}

export function getConfigNotify() {
  let urlFetch = getConfigApi().organization + '/configNotify'
  return getFetch(urlFetch)
}

export function updateConfigNotify(_id, data) {
  let url = getConfigApi().organization + `/configNotify/${_id}`
  return putFetch(url, data)
}

export function updateNotifyChannel(organizationId, data) {
  let url = getConfigApi().organization + `/updateNotifyChannel/${organizationId}`
  return putFetch(url, data)
}

export function switchNotifyChannel(organizationId, data) {
  let url = getConfigApi().organization + `/switchNotifyChannel/${organizationId}`
  return putFetch(url, data)
}

export default {
  getSubscription,
  updateOrganizationNameLogo,
  updateTransferFtpInfo,
  getOrganization,
  createFilter,
  updateFilter,
  deleteFilter,
  getConfigNotify,
  updateConfigNotify,
  updateNotifyChannel,
  switchNotifyChannel
}
