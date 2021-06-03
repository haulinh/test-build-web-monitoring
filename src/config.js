/* eslint-disable */
export function getConfigApi() {
  const config = window.config
  function c(prefix) {
    return config.apiGateway + '/' + prefix
  }
  return {
    gateway: config.apiGateway,
    media: config.apiMedia,
    minio: c('drive'),
    mediaMinio: config.apiMediaMinio,
    category: c('category'),
    // category: 'http://localhost:5002',
    auth: c('auth'),
    // auth: 'http://localhost:5001/auth',
    user: c('user'),
    // user: 'http://localhost:5005/user',
    trialRegister: c('trial-register'),
    config: c('config'),

    measuring: c('measuring'),
    stationType: c('station-type'),
    stationAuto: c('station-auto'),
    // stationAuto: "http://localhost:5003/station-auto",
    dataStationAuto: c('data-station-auto'),
    // dataStationAuto: 'http://localhost:5004/data-station-auto',
    // historicalData: c('historical-data'),
    // historicalData: 'http://localhost:5022/historical-data',
    report: c('report'),
    // report: 'http://localhost:5004/report',
    stationFixed: c('station-fixed'),
    // stationFixed: 'http://localhost:5018',
    stationFixedPhase: c('station-fixed/phases'),
    stationFixedPhase: 'http://localhost:5018/phases',
    // stationFixedDataPoint: c('station-fixed/data-points'),
    stationFixedDataPoint: 'http://localhost:5018/data-points',
    stationFixedExportDataPoint: 'http://localhost:5018/export-data-points',
    // stationFixedExportDataPoint: c('station-fixed/export-data-points'),
    stationFixedPoint: c('station-fixed/points'),
    // stationFixedPoint: 'http://localhost:5018/points',
    dataStationFixed: c('data-station-fixed'),

    stationConfig: c('config/station'),
    // stationConfig: 'http://localhost:5002/config/station',

    // aqiListConfig: 'http://localhost:5002/config/aqi-list-config',
    // aqiConfigQC: 'http://localhost:5002/config/aqi-qc',
    // aqiConfigCalculation: 'http://localhost:5002/config/aqi-calculation',
    // aqi_v1: 'http://localhost:5015/aqi-v1',
    // aqi: "http://localhost:5050/aqi",
    aqiConfigQC: c('config/aqi-qc'),
    aqiListConfig: c('config/aqi-list-config'),
    aqiConfigCalculation: c('config/aqi-calculation'),
    aqi: c('aqi'),
    aqi_v1: c('aqi-v1'),

    // qaqcConfig: 'http://localhost:5002/config/qaqc',
    qaqcConfig: c('config/qaqc'),
    wqiListConfig: c('config/wqi-list-config'),
    wqiConfigCalculation: c('config/wqi-calculation'),
    wqiConfigWeight: c('config/wqi-weight-param'),
    wqiConfigCalParams: c('config/wqi-cal-param'),
    wqiConfigMeaTable: c('config/wqi-mea-table'),

    // aqiConfigQC: 'http://localhost:5002/config/aqi-qc',
    ftp: c('ftp'),
    fcmMessages: c('fcm-messages'),
    fcmToken: c('fcm-token'),
    fcmNotification: c('fcm-notification'),

    // fcmMessages: 'http://192.168.0.185:5008/fcm-messages',
    // fcmNotification: 'http://192.168.0.185:5008/fcm-notification',
    // fcmToken: 'http://192.168.0.185:5008/fcm-token',

    organization: c('organization'),
    // organization: 'http://localhost:5005/organization',
    role: c('role'),
    sampling: c('samplingNew'),
    // sampling: 'http://localhost:5020/samplingNew',
    // sampling: c('sampling'),
    support: c('support'),
    province: c('province'),
    // qcvn: c('qcvn'),
    qcvn: 'http://localhost:5002/qcvn',
    aqi: c('aqi'),
    aqi_v1: c('aqi-v1'),
    // aqi_v1: 'http://localhost:5015/aqi-v1',
    wqi: c('wqi'),
    // wqi: 'http://localhost:5017/wqi',
    notify: c('notify'),
    // notify: 'http://localhost:5007/notify',
    sampleConfig: c('configSample'),

    // mobile
    mobile: c('mobile2'),
    // mobile: 'http://localhost:3000',

    dataInsight: c('data-insight'),
    // dataInsight: 'http://localhost:5022',

    admin: c('admin'),
    // admin: 'http://localhost:5005',
    camera: config.camera,
    firebase: config.firebase,
    isAdvanced: config.isAdvanced,
    defaultPage: config.defaultPage,
  }
}

export function getApps() {
  const config = window.config
  return {
    isShow: config.apps.isShow,
    incidents: config.apps.incidents,
    grafana: config.apps.grafana,
  }
}

export const GOOGLE_MAP = {
  KEY: process.env.GOOGLE_MAP_KEY || 'AIzaSyB8Lw-LWcdPxtz01j99UE44V9QUFw9vEO4',
}

export const GOOGLE_TAG_TRACKING_ID = 'GTM-KPZCRHG'
