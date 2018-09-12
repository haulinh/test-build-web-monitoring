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
    auth: c('auth'),//'http://localhost:5001/auth',
    user: c('user'),//'http://localhost:5005/user',
    trialRegister: c('trial-register'),
    measuring: c('measuring'),
    stationType: c('station-type'),
    stationAuto: c('station-auto'),
    dataStationAuto: c('data-station-auto'),
    ftp: c('ftp'),
    //tp: 'http://localhost:5009/ftp', //comemnt lcoal
    fcmMessages: c('fcm-messages'),
    organization: c('organization'), //'http://localhost:5005/organization',
    role: c('role'),
    sampling: c('sampling'),
    support: c('support'),
    province: c('province'),
    qcvn: c('qcvn'),
    // support: 'http://localhost:5014/support', //comemnt lcoal
    sampleConfig: 'http://localhost:5010/configSample/upload-config' // local.
  }
}

export const GOOGLE_MAP = {
  KEY: 'AIzaSyB2-wp_CpzQQOkmacIaA2Xj90G8E_wiJiw'
}
