import { getConfigApi } from "config";

export default function registerServiceWorkerFireBase() {
  let dirFileBase = "./firebase-messaging-sw.js";
  if (getConfigApi().NODE_ENV === "production")
    dirFileBase = "./firebase-messaging-sw-pro.js";

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(dirFileBase)
      .then(function(registration) {
        console.log("Registration successful, scope is:", registration.scope);
      })
      .catch(function(err) {
        console.log("Service worker registration failed, error:", err);
      });
  }
}
