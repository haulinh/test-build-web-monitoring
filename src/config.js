import { get } from 'lodash'

/* eslint-disable */
export function getConfigApi() {
  const config = window.config
  function c(prefix) {
    return config.apiGateway + '/' + prefix
  }
  return {
    gateway: config.apiGateway,
    media: config.apiMedia,
    camera: config.apiCamera,
    auth: c('auth'),
    user: c('user'),
    trialRegister: c('trial-register'),
    measuring: c('measuring'),
    stationType: c('station-type'),
    stationAuto: c('station-auto'),
    dataStationAuto: c('data-station-auto'),
    stationFixed: c('station-fixed'),
    dataStationFixed: c('data-station-fixed'),
  //  stationConfig: c('config/station'), //stationConfig: 'http://localhost:5002/config/station'
    stationConfig: 'http://localhost:5002/config/station',
    ftp: c('ftp'),
    fcmMessages: c('fcm-messages'),
    organization: c('organization'),
    role: c('role'),
    sampling: c('sampling'),
    support: c('support'),
    province: c('province'),
    qcvn: c('qcvn'),
    aqi: c('aqi'),
    wqi:c('wqi'),
    // support: 'http://localhost:5014/support', //comemnt lcoal
    sampleConfig: c('configSample') // local.
  }
}

export const GOOGLE_MAP = {
  KEY: get(window, 'config.googleMapKey', '') //'AIzaSyB2-wp_CpzQQOkmacIaA2Xj90G8E_wiJiw'
}
