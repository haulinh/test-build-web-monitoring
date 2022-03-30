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
    // measuring: 'http://localhost:5002/measuring',

    stationType: c('station-type'),
    stationAuto: c('station-auto'),
    // stationAuto: 'http://localhost:5003/station-auto',
    dataStationAuto: c('data-station-auto'),
    // dataStationAuto: 'http://localhost:5004/data-station-auto',
    report: c('report'),
    stationFixed: c('station-fixed'),

    stationFixedPhase: c('station-fixed/phases'),
    stationFixedDataPoint: c('station-fixed/data-points'),
    stationFixedExportDataPoint: c('station-fixed/export-data-points'),
    stationFixedPoint: c('station-fixed/points'),
    stationFixedReport: c('station-fixed/report'),
    stationFixedReportLog: c('station-fixed/report-logs'),
    stationFixedPeriodic: c('station-fixed/station-periodic'),
    dataStationFixed: c('data-station-fixed'),
    // report: 'http://localhost:5004/report',
    // stationFixed: 'http://localhost:5018',
    // stationFixedPhase: 'http://localhost:5018/phases',
    // stationFixedDataPoint: 'http://localhost:5018/data-points',
    // stationFixedExportDataPoint: 'http://localhost:5018/export-data-points',
    //stationFixedPoint: 'http://localhost:5018/points',
    calculate: c('calc'),
    // calculate: 'http://localhost:5030',

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
    language: c('config/language'),
    // language: 'http://localhost:5002/config/language',

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
    qcvn: c('qcvn'),
    // qcvn: 'http://localhost:5002/qcvn',
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
    googleMapKey: config.googleMapKey,
  }
}

export const GOOGLE_TAG_TRACKING_ID = 'GTM-KPZCRHG'
