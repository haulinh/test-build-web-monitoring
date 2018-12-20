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
    auth: c('auth'), //'http://localhost:5001/auth',
    user: c('user'), //'http://localhost:5005/user',
    trialRegister: c('trial-register'),
    measuring: c('measuring'),
    stationType: c('station-type'),
    stationAuto: c('station-auto'),
    stationFixed: 'http://localhost:5019/station-fixed',
   // stationFixed: c('station-fixed') || 'http://localhost:5003/station-fixed',
    dataStationAuto: c('data-station-auto'),
    // dataStationAuto: 'http://localhost:5004/data-station-auto',
    ftp: c('ftp'),
    // ftp: 'http://localhost:5009/ftp', //comemnt lcoal
    fcmMessages: c('fcm-messages'),
    organization: c('organization'), //'http://localhost:5005/organization',
    role: c('role'),
    sampling: c('sampling'),
    support: c('support'),
    province: c('province'),
    qcvn: c('qcvn'),
    aqi: c('aqi'),
    wqi:c('wqi'), //'http://10.28.85.117:5016/wqi'
    // support: 'http://localhost:5014/support', //comemnt lcoal
    sampleConfig: c('configSample') // local.
  }
}

export const GOOGLE_MAP = {
  KEY: get(window, 'config.googleMapKey', '') //'AIzaSyB2-wp_CpzQQOkmacIaA2Xj90G8E_wiJiw'
}
