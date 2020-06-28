import querystring from 'querystring'
import { getFetch, postFetch, putFetch, deleteFetch } from 'utils/fetch'
import { getConfigApi } from 'config'

export function getNotification() {
  return getFetch(fcmNotificationRoute().fcmMessages)
}

export function get() {
  return getFetch(fcmNotificationRoute().notify)
}

/* --------- launching --------- */

/* TIP  link postman
https://www.getpostman.com/collections/cef48462029130ceafb9?fbclid=IwAR0LaBhlJ6h3MtjjoKOywFyZGEf6XmKo31v5sZ4FeD7BH3DqwEQAEf1Q0EY
*/

const fcmNotificationRoute = () => getConfigApi().fcmNotification

export function updateIsSeenByType(type) {
  return putFetch(`${fcmNotificationRoute()}/updateIsSeen`, { type })
}

export function updateIsSeenAll() {
  return putFetch(`${fcmNotificationRoute()}/updateIsSeenAll`)
}

export function updateIsRead(_id) {
  return putFetch(`${fcmNotificationRoute()}/updateIsRead/${_id}`)
}

export function updateReadAll() {
  return putFetch(`${fcmNotificationRoute()}/updateIsRead`)
}

export function deleteOne(notificationId) {
  return deleteFetch(`${fcmNotificationRoute()}/${notificationId}`)
}

export function updateNotReadOne(notificaitonId) {
  return putFetch(`${fcmNotificationRoute()}/updateIsNotRead/${notificaitonId}`)

}

export function loadNotificationsByType(params) {
  // params: {page, itemPerPage, type}
  let qryString = querystring.stringify(params)
  return getFetch(`${fcmNotificationRoute()}/?${qryString}`)
}

export function getTotalByNotificationType() {
  return getFetch(`${fcmNotificationRoute()}/getTotalByNotificationType`)
}

export function deleteToken(token, email) {
  return deleteFetch(`${getConfigApi().fcmToken}?token=${token}&email=${email}`)
}

export function linkToken2Email(token) {
  return postFetch(getConfigApi().fcmToken, {
    token,
    device: 'webapp', // MARK  webapp is constaint
  })
}

export default {
  getNotification,
  updateIsSeenByType,
  updateIsSeenAll,
  getTotalByNotificationType,
  loadNotificationsByType,
  linkToken2Email,
  deleteToken,
  updateIsRead,
}
