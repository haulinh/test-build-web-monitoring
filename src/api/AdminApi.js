import { getConfigApi } from '../config'
import { getFetch } from 'utils/fetch'

function getAdminUrl(prefix = '') {
  return getConfigApi().admin + '/' + prefix
}

export function fetchApps() {
  const url = getAdminUrl('apps')
  return getFetch(url)
}
