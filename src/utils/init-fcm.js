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
export { messaging }
