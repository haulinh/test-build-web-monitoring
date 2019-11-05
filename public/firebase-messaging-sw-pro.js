importScripts("https://www.gstatic.com/firebasejs/5.11.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/5.11.1/firebase-messaging.js"
);

// MARK  fire_id
firebase.initializeApp({
  messagingSenderId: "378057037919"
});

const messaging = firebase.messaging();

// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   var notificationTitle = 'Background Message Title';
//   var notificationOptions = {
//     body: 'Background Message body.',
//     icon: '/firebase-logo.png'
//   };

//   return self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });

// self.addEventListener("notificationclick", function(event) {
//   // do what you want
//   // ...
//   event.notification.close();
//   var url = event.notification.data.FCM_MSG.notification.click_action;
//   if (!url) return;
//   event.waitUntil(
//     clients
//       .matchAll({
//         type: "window",
//         includeUncontrolled: true
//       })
//       .then(function(windowClients) {
//         for (var i = 0; i < windowClients.length; i++) {
//           var client = windowClients[i];
//           if (
//             (client.url === url || client.url.includes(url)) &&
//             "focus" in client
//           ) {
//             return client.focus();
//           }
//         }
//         if (clients.openWindow) {
//             return clients.openWindow(url);
//         }
//       })
//   );
// });

// messaging.setBackgroundMessageHandler(function(payload) {
//   console.log('dadadadadada')
//   const promiseChain = clients
//     .matchAll({
//       type: "window",
//       includeUncontrolled: true
//     })
//     .then(windowClients => {
//       for (let i = 0; i < windowClients.length; i++) {
//         const windowClient = windowClients[i];
//         windowClient.postMessage(payload);
//       }
//     })
//     .then(() => {
//       return registration.showNotification("my notification title");
//     });
//   return promiseChain;
// });
