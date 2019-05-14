import { getFetch, postFetch, deleteFetch } from 'utils/fetch'
import { getConfigApi } from 'config'

export function getNotification() {
  return getFetch(getConfigApi().fcmMessages)
}

export function get() {
  return getFetch(getConfigApi().notify)
}

export function deleteToken(token,email) {
  return deleteFetch(`${getConfigApi().fcmToken}?token=${token}&email=${email}`)
}

export function linkToken2Email(token){
  return postFetch(getConfigApi().fcmToken, {
    token,
    device: 'webapp' // MARK  webapp is constaint
  })
}

export default {
  getNotification,
  linkToken2Email,
  deleteToken
}





// fcmMessages: c('fcm-messages'),
// fcmNotification: c('fcm-notification'),
// fcmToken: c('fcm-token'),