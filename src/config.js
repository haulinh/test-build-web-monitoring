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
    // auth: 'http://localhost:5001/auth',
    user: c('user'),
    trialRegister: c('trial-register'),
    measuring: c('measuring'),
    stationType: c('station-type'),
    stationAuto: c('station-auto'),
    // stationAuto: 'http://localhost:5003/station-auto',
    dataStationAuto: c('data-station-auto'),
    // dataStationAuto:'http://localhost:5004/data-station-auto',
    report: c('report'),
    // report: 'http://localhost:5004/report',
    stationFixed: c('station-fixed'),
    dataStationFixed: c('data-station-fixed'),
    stationConfig: c('config/station'),
    qaqcConfig: c('config/qaqc'),
    // qaqcConfig: 'http://localhost:5002/config/qaqc',
    aqiConfigCalculation: c('config/aqi-calculation'),
    // aqiConfigCalculation: 'http://localhost:5002/config/aqi-calculation',
    aqiConfigQC: c('config/aqi-qc'),
    // aqiConfigQC: 'http://localhost:5002/config/aqi-qc',
    ftp: c('ftp'),
    fcmMessages: c('fcm-messages'),
    // fcmMessages: 'http://localhost:5008/fcm-messages',
    fcmNotification: c('fcm-notification'),
    // fcmNotification: 'http://localhost:5008/fcm-notification',
    fcmToken: c('fcm-token'),
    organization: c('organization'),
    role: c('role'),
    sampling: c('samplingNew'),
    // sampling: c('sampling'),
    support: c('support'),
    province: c('province'),
    qcvn: c('qcvn'),
    aqi: c('aqi'),
    // aqi_v1: c('aqi-v1'),
    aqi_v1: 'http://localhost:5015/aqi-v1',
    wqi: c('wqi'),
    notify: c('notify'),
    sampleConfig: c('configSample'),
    camera: config.camera,
    firebase: config.firebase,
    isAdvanced:config.isAdvanced,

    defaultPage: config.defaultPage
  }
}


export const GOOGLE_MAP = {
  KEY: process.env.GOOGLE_MAP_KEY || "AIzaSyB8Lw-LWcdPxtz01j99UE44V9QUFw9vEO4"
}
