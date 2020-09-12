import * as firebase from 'firebase/app'
import 'firebase/messaging'
import { getConfigApi } from '../config'

const initializedFirebaseApp = firebase.initializeApp({
  // Project Settings => Add Firebase to your web app
  messagingSenderId: getConfigApi().firebase.id,
})

// KEYYYYY
const messaging = initializedFirebaseApp.messaging()
messaging.usePublicVapidKey(
  // Project Settings => Cloud Messaging => Web Push certificates
  // "BFl94_PkChgm29pzLORmK3ontJsbkGmWDoO4z1gJBjIiW-j5vbp8IlVy18OydRo4GBrPF2l-dLl0OANbDFxYtHM"
  getConfigApi().firebase.key
)

// MARK  fire when focus tab web
messaging.onMessage(function(payload) {
  console.log('Message code. ', payload)
  // ...
})

// export const unsubscribeFCM = () => {
//   navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
//     serviceWorkerRegistration.pushManager
//       .getSubscription()
//       .then(pushSubscription => {
//         if (!pushSubscription) {
//         }

//         let subscriptionId = pushSubscription.subscriptionId

//         console.log(subscriptionId, '_____SUB ID_____')

//         pushSubscription
//           .unsubscribe()
//           .then(function(successful) {
//             // pushButton.disabled = false
//             // pushButton.textContent = 'Enable Push Messages'
//             // isPushEnabled = false
//             console.log(successful, '_____DISABLE____')
//           })
//           .catch(function(e) {
//             // We failed to unsubscribe, this can lead to
//             // an unusual state, so may be best to remove
//             // the users data from your data store and
//             // inform the user that you have done so

//             console.log('Unsubscription error: ', e)
//             // pushButton.disabled = false
//             // pushButton.textContent = 'Enable Push Messages'
//           })
//       })
//       .catch(e => {
//         console.error(
//           'Error thrown while unsubscribing from push messaging.',
//           e
//         )
//       })
//   })
// }
export { messaging }
