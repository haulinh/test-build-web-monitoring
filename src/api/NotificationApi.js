import { getFetch, putFetch } from 'utils/fetch'
import { getConfigApi } from 'config'

const fcmNotificationRoute = getConfigApi().fcmNotification 


export function getNotification() {
  return getFetch(getConfigApi().fcmMessages)
}

export function get() {
  return getFetch(getConfigApi().notify)
}


/* --------- launching --------- */

/* TIP  link postman
https://www.getpostman.com/collections/cef48462029130ceafb9?fbclid=IwAR0LaBhlJ6h3MtjjoKOywFyZGEf6XmKo31v5sZ4FeD7BH3DqwEQAEf1Q0EY
*/

export function updateIsSeenByType({type}){
  return putFetch(`${fcmNotificationRoute}/updateIsSeen`, {type})
}

export default {
  getNotification,
  updateIsSeenByType
}
