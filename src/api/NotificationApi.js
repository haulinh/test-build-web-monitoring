import querystring from 'querystring'
import { getFetch, postFetch, putFetch } from 'utils/fetch'
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

export function updateIsSeenByType(type){
  return putFetch(`${fcmNotificationRoute()}/updateIsSeen`, {type})
}

export function loadNotificationsByType(params){  // params: {page, itemPerPage, type}
  let qryString = querystring.stringify(params)
  return getFetch(`${fcmNotificationRoute()}/?${qryString}`)
}

export function getTotalByNotificationType(){
  return getFetch(`${fcmNotificationRoute()}/getTotalByNotificationType`)
}

export function linkToken2Email(token){
  return postFetch(getConfigApi().fcmToken, {
    token,
    device: 'webapp' // MARK  webapp is constaint
  })
}

export default {
  getNotification,
  updateIsSeenByType,
  getTotalByNotificationType
  linkToken2Email
}