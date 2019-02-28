import { getFetch } from 'utils/fetch'
import { getConfigApi } from 'config'

export function getNotification() {
  return getFetch(getConfigApi().fcmMessages)
}

export function get() {
  return getFetch(getConfigApi().notify)
}

export default {
  getNotification
}
