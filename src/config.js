/* eslint-disable */
export function getConfigApi() {
  const config = window.config
  function c(prefix) {
    return config.apiGateway + '/' + prefix
  }
  return {
    gateway: config.apiGateway,
    media: config.apiMedia,
    auth: c('auth'),
    user: c('user'),
    trialRegister: c('trial-register'),
    measuring: c('measuring'),
    stationType: c('station-type'), 
    stationAuto: c('station-auto'),
    dataStationAuto: c('data-station-auto'),
    stationFixed: c('station-fixed'),
    dataStationFixed: c('data-station-fixed'),
    stationConfig: c('config/station'),
    ftp: c('ftp'),
    fcmMessages: c('fcm-messages'),
    fcmNotification: 'http://localhost:5008/fcm-notification',
    // fcmNotification: c('fcm-notification'),
    fcmToken: c('fcm-token'),
    organization: c('organization'),
    role: c('role'),
    sampling: c('samplingNew'),
    // sampling: c('sampling'),
    support: c('support'),
    province: c('province'),
    qcvn: c('qcvn'),
    aqi: c('aqi'),
    wqi: c('wqi'),
    notify: c('notify'),
    sampleConfig: c('configSample'), // local.,
    camera: config.camera,
    firebase: config.firebase
  }
}


export const GOOGLE_MAP = {
  KEY: process.env.GOOGLE_MAP_KEY || "AIzaSyB8Lw-LWcdPxtz01j99UE44V9QUFw9vEO4"
}
