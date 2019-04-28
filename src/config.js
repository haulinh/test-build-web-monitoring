import { get } from 'lodash'


//dev: http://35.198.234.113:5000
//deploy: http://Duong dan public
const WEB_GATEWAY_API = process.env.WEB_GATEWAY_API

/* eslint-disable */
export function getConfigApi() {
// console.log(process.env.haha)
  const config = window.config
  function c(prefix) {
    return config.apiGateway + '/' + prefix
    // return WEB_GATEWAY_API + '/' + prefix
  }
  return {
    gateway: config.apiGateway,
    media: config.apiMedia,
    auth: c('auth'),
    user: c('user'),
    trialRegister: c('trial-register'),
    measuring: c('measuring'),
    stationType: c('station-type'), // stationType: 'http://localhost:5002/station-type',
    stationAuto: c('station-auto'),
    dataStationAuto: c('data-station-auto'), //dataStationAuto: 'http://localhost:5004/data-station-auto',
    // dataStationAuto: 'http://localhost:5004/data-station-auto',
    stationFixed: c('station-fixed'),
    dataStationFixed: c('data-station-fixed'),
    stationConfig: c('config/station'), //stationConfig: 'http://localhost:5002/config/station'
    ftp: c('ftp'),
    fcmMessages: c('fcm-messages'),
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
   // wqi: 'http://192.168.1.72:5017/wqi',
    // support: 'http://localhost:5014/support', //comemnt lcoal
    sampleConfig: c('configSample'), // local.,
    
    camera: config.camera,
  }
}

export const GOOGLE_MAP = {
  KEY: process.env.GOOGLE_MAP_KEY || "AIzaSyB8Lw-LWcdPxtz01j99UE44V9QUFw9vEO4"
}
