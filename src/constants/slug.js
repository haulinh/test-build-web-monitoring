import { translate } from 'hoc/create-lang'

export default {
  dashboard: '/',
  login: '/login',
  controlStation: {
    base: '/control-station',
    trigger: '/control-station/:key/:name',
    triggerWithKey: '/control-station',
    config: '/control-station/config/:key/:name',
    configWithKey: '/control-station/config',
    history: '/control-station/history/:key/:name',
    historyWithKey: '/control-station/history',
  },
  measuring: {
    list: '/measuring',
    base: '/measuring',
    create: '/measuring/create',
    edit: '/measuring/edit/:key',
    editWithKey: '/measuring/edit',
  },
  province: {
    list: '/province',
    base: '/province',
    create: '/province/create',
    edit: '/province/edit/:key',
    editWithKey: '/province/edit',
  },
  qcvn: {
    list: '/qcvn',
    base: '/qcvn',
    create: '/qcvn/create',
    edit: '/qcvn/edit/:key',
    editWithKey: '/qcvn/edit',
  },
  ftpTransfer: {
    list: '/ftp-transfer',
    base: '/ftp-transfer',
    history: '/ftp-transfer/history/:key/:name',
    historyWithKey: '/ftp-transfer/history',
  },
  stationType: {
    list: '/station-type',
    base: '/station-type',
    create: '/station-type/create',
    edit: '/station-type/edit/:key',
    editWithKey: '/station-type/edit',
  },
  stationAuto: {
    list: '/station-auto',
    base: '/station-auto',
    create: '/station-auto/create',
    edit: '/station-auto/edit/:key',
    editWithKey: '/station-auto/edit',
    configConnection: {
      base: '/station-auto/config/connection',
      ftp: '/station-auto/config/connection/ftp',
      ftpWithKey: '/station-auto/config/connection/ftp/:key',
      file: '/station-auto/config/connection/file',
      fileWithKey: '/station-auto/config/connection/file/:key',
    },
    configSendNotification: {
      base: '/station-auto/config/notification',
    },
    configSampling: {
      base: '/station-auto/config/sampling',
    },
    configColor: {
      base: '/station-auto/config/color',
    },
    configCamera: {
      base: '/station-auto/config/camera',
    },
    range: '/station-auto/range/:key',
    configWithKey: '/station-auto/config',
    rangeWithKey: '/station-auto/range',
    ftpInfo: '/station-auto/ftpInfo/:key',
    ftpInfoWithKey: '/station-auto/ftpInfo',
    ftpFile: '/station-auto/ftpFile/:key',
    ftpFileWithKey: '/station-auto/ftpFile',
  },
  stationFixed: {
    list: '/station-fixed',
    base: '/station-fixed',
    create: '/station-fixed/create',
    edit: '/station-fixed/edit/:key',
    editWithKey: '/station-fixed/edit',
  },
  configWQI: {
    list: '/config-wqi',
    base: '/config-wqi',
  },
  onlineMonitoring: {
    base: '/online-monitoring',
  },
  monitoring: {
    base: '/monitoring',
    viewCamera: '/monitoring/camera/:key',
    viewCameraWithKey: '/monitoring/camera',
  },
  monitoringList: {
    base: '/monitoringList',
  },
  cameraControl: {
    base: '/cameraControl',
    detail: '/cameraControl/detail/:key/:name',
    detailWithKey: '/cameraControl/detail',
  },
  map: {
    base: '/map',
    aqi: '/map/aqi',
  },
  dataSearch: {
    base: '/data-search',
  },
  avgSearchAdvanced: {
    base: '/avg-search-advanced',
  },
  avgSearch: {
    base: '/avg-search',
  },
  dataSearchFixed: {
    base: '/fixed-data-search',
  },
  password: {
    emailConfirm: '/password/email-confirm',
    codeConfirm: '/password/code-confirm/:key',
    codeConfirmWithKey: '/password/code-confirm',
    resetPassword: '/password/reset-password',
  },
  user: {
    list: '/user',
    base: '/user',
    create: '/user/create',
    edit: '/user/edit/:key',
    editWithKey: '/user/edit',
    changePassword: '/user/change-password',
    configStation: '/user/config-station',
    infoLicense: '/user/info-package',
    expLicense: '/user/exp-license',
    profile: '/user/profile',
    security: '/user/security',
    rule: '/user/rule',
    accountActive: '/account/activate/:key',
  },
  role: {
    list: '/role',
    base: '/role',
    create: '/role/create',
    edit: '/role/edit/:_id',
    editWithKey: '/role/edit',
  },
  camera: {
    base: '/camera',
    camera: '/camera/:key',
    cameraWithKey: '/camera',
  },
  subscription: {
    base: '/subscription',
  },
  support: {
    base: '/support',
    create: '/support/create',
  },
  aqi: {
    base: '/aqi',
    config: '/aqi-config',
    configEdit: '/aqi-config/:key',
    configWithKey: '/aqi-config',
    status: '/aqi-info',
  },
  wqi: {
    base: '/wqi',
    config: '/wqi-config',
    configEdit: '/wqi-config/:key',
    configWithKey: '/wqi-config',
  },
  qaqc: {
    base: '/qaqc',
    list: '/qaqc',
    config: '/qaqc-config',
    configNew: '/qaqc-configNew',
  },
  statistic: {
    exceeded: '/exceeded-statistic',
    perRecData: '/per-rec-data-statistic',
    aqi: '/statistic-aqi',
    wqi: '/statistic-wqi',
  },
  mapFixed: {
    base: '/fixed-map',
  },
  report: {
    base: '/report',
    type1: '/report/type1',
    type2: '/report/type2', // Quan trắc TB 24h
    type3: '/report/type3',
    type4: '/report/type4',
    type5: '/report/type5',
    type6: '/report/type6',
    type7: '/report/type7',
    type8: '/report/type8',
    type9: '/report/type9',
    type10: '/report/type10', // tỉ lệ dữ liệu thu đươc
    type11: '/report/type11', // Ket qua quan trac trung binh gio cua 1 ngay
    type12: '/report/type12', // tỷ lệ dữ liệu vượt ngưỡng của 1 trạm
    status_data: '/report/status-data',
  },
  advance:{
    base: '/advance',
    mapAqi: '/advance/aqi-map',
    aqi_hour: '/advance/aqi-hour',
    aqi_day: '/advance/aqi-day',
    wqi_hour: '/advance/wqi-hour',
    wqi_day: '/advance/wqi-day',
    mapWqi: '/advance/wqi',
    enableAqiWqi: '/advance/enable-aqi-wqi',
    configAqi: '/advance/aqi-config',
    configAqiEdit: '/advance/aqi-config/:key',
    configAqiWithKey: '/advance/aqi-config',
    status: '/advance/aqi-info',
    configWqi: '/advance/wqi-config',
    configEditWqi: '/advance/wqi-config/:key',
    configWqiWithKey: '/advance/wqi-config',

  },
  dataLogger: {
    base: '/log',
    list: '/log',
  },
  apps: {
    incidents: '/apps/incidents',
  },
}

export const MENU_GROUP = {
  DASHBOARD: 'dashboard',
  MONITORING: 'monitoring',
  HANDLE_DATA: 'handleData',
  SHARE_DATA: 'shareData',
  REPORT: 'report',
  ADVANCE: 'advance',
  CONFIG: 'config',
}

export const parentMenuFromSub = {
  '/map': MENU_GROUP.MONITORING,
  '/monitoring': MENU_GROUP.MONITORING,
  '/cameraControl': MENU_GROUP.MONITORING,
  '/data-search': MENU_GROUP.MONITORING,
  '/avg-search': MENU_GROUP.MONITORING,

  '/qaqc': MENU_GROUP.HANDLE_DATA,
  '/qaqc-configNew': MENU_GROUP.HANDLE_DATA,

  '/qaqc-config': MENU_GROUP.SHARE_DATA,
  '/ftp-transfer': MENU_GROUP.SHARE_DATA,

  // '/map-aqi': MENU_GROUP.ADVANCE,
  // '/statistic-aqi': MENU_GROUP.ADVANCE,
  // '/wqi': MENU_GROUP.ADVANCE,
  // '/statistic-wqi': MENU_GROUP.ADVANCE,
  // '/config-wqi': MENU_GROUP.ADVANCE,

  '/station-auto': MENU_GROUP.CONFIG,
  '/measuring': MENU_GROUP.CONFIG,
  '/station-type': MENU_GROUP.CONFIG,
  '/province': MENU_GROUP.CONFIG,
  '/qcvn': MENU_GROUP.CONFIG,
  '/role': MENU_GROUP.CONFIG,
  '/user': MENU_GROUP.CONFIG,
  '/report': MENU_GROUP.REPORT,
  '/advance': MENU_GROUP.ADVANCE,
}

export const MENU_NAME = {
  dashboard: translate('menuApp.dashboard'),

  monitoringSub: translate('menuApp.monitoringSub'),
  monitoring: {
    base: translate('menuApp.monitoring.base'),
    map: translate('menuApp.monitoring.map'),
    mapAQI: translate('menuApp.monitoring.mapAQI'),
    camera: translate('menuApp.monitoring.camera'),
    historyData: translate('menuApp.monitoring.historyData'),
    avgData: translate('menuApp.monitoring.avgData'),
    report: translate('menuApp.monitoring.report'),
  },
  monitoringList: {
    base: translate('menuApp.monitoringList.base'),
  },

  processDataSub: translate('menuApp.processDataSub'),
  processData: {
    approveData: translate('menuApp.processData.approveData'),
    configNew: translate('menuApp.processData.config'),
  },

  shareDataSub: translate('menuApp.shareDataSub'),
  shareData: {
    shareConfig: translate('menuApp.shareData.shareConfig'),
    ftpConfig: translate('menuApp.shareData.ftpConfig'),
  },

  reportSub: translate('menuApp.reportSub'),
  report: {
    type1: translate('menuApp.report.type1'),
    type2: translate('menuApp.report.type2'),
    type3: translate('menuApp.report.type3'),
    type4: translate('menuApp.report.type4'),
    type5: translate('menuApp.report.type5'),
    type6: translate('menuApp.report.type6'),
    type7: translate('menuApp.report.type7'),
    type8: translate('menuApp.report.type8'),
    type9: translate('menuApp.report.type9'),
    type10: translate('menuApp.report.type10'),
    type11: translate('menuApp.report.type11'),
    type12: translate('menuApp.report.type12'),
    aqi_hour: translate('menuApp.report.aqiHour'),
    aqi_day: translate('menuApp.report.aqiDay'),
    aqi_878: translate('menuApp.report.aqi878'),
    status_data: translate('menuApp.report.status_data'),
  },

  advanceSub: translate('menuApp.advanceSub'),
  advance: {
    aqiMap: translate('menuApp.advance.aqiMap'),
    aqiStatistic: translate('menuApp.advance.aqiStatistic'),
    wqiMap: translate('menuApp.advance.wqiMap'),
    wqiHour: translate('menuApp.advance.wqiHour'),
    wqiDay: translate('menuApp.advance.wqiDay'),
    wqiStatistic: translate('menuApp.advance.wqiStatistic'),
    config: translate('menuApp.advance.config'),
  },

  configSub: translate('menuApp.configSub'),
  config: {
    stationAuto: translate('menuApp.config.stationAuto'),
    stationAutoConnection: translate('menuApp.config.stationAutoConnection'),
    sendNotification: translate('menuApp.config.sendNotification'),
    sampling: translate('menuApp.config.sampling'),
    configAQI: translate('menuApp.config.configAQI'),
    configWQI: translate('menuApp.config.configWQI'),
    camera: translate('menuApp.config.camera'),
    color: translate('menuApp.config.color'),
    parameter: translate('menuApp.config.parameter'),
    stationType: translate('menuApp.config.stationType'),
    site: translate('menuApp.config.site'),
    standard: translate('menuApp.config.standard'),
    role: translate('menuApp.config.role'),
    user: translate('menuApp.config.user'),
    dataLogger: translate('menuApp.config.dataLogger'),
  },
}

export const TOOLTIP_MENU = {
  dashboard: translate('tooltipMenuApp.dashboard'),
  monitoringSub: translate('tooltipMenuApp.monitoringSub'),
  monitoring: {
    base: translate('tooltipMenuApp.monitoring.base'),
    map: translate('tooltipMenuApp.monitoring.map'),
    camera: translate('tooltipMenuApp.monitoring.camera'),
    historyData: translate('tooltipMenuApp.monitoring.historyData'),
    avgData: translate('tooltipMenuApp.monitoring.avgData'),
    mapAQI: translate('tooltipMenuApp.monitoring.mapAQI'),
  },
  monitoringList: {
    base: translate('tooltipMenuApp.monitoringList.base'),
  },
  processDataSub: translate('tooltipMenuApp.processDataSub'),
  processData: {
    configNew: translate('tooltipMenuApp.processData.configNew'),
    approveData: translate('tooltipMenuApp.processData.approveData'),
  },
  shareDataSub: translate('tooltipMenuApp.shareDataSub'),
  shareData: {
    shareConfig: translate('tooltipMenuApp.shareData.shareConfig'),
    ftpConfig: translate('tooltipMenuApp.shareData.ftpConfig'),
  },
  reportSub: translate('tooltipMenuApp.reportSub'),
  report: {
    type10: translate('tooltipMenuApp.report.type10'),
    type2: translate('tooltipMenuApp.report.type2'),
    type11: translate('tooltipMenuApp.report.type11'),
    type3: translate('tooltipMenuApp.report.type3'),
    type4: translate('tooltipMenuApp.report.type4'),
    type12: translate('tooltipMenuApp.report.type12'),
    status_data: translate('tooltipMenuApp.report.status_data'),
    aqi_hour: translate('tooltipMenuApp.report.aqi_hour'),
    aqi_day: translate('tooltipMenuApp.report.aqi_day'),
  },
  advanceSub: translate('tooltipMenuApp.advanceSub'),
  advance: {
    wqiMap: translate('tooltipMenuApp.advance.wqiMap'),
    wqiHour: translate('tooltipMenuApp.advance.wqiHour'),
    wqiDay: translate('tooltipMenuApp.advance.wqiDay'),
    config: translate('tooltipMenuApp.advance.config'),
  },
  configSub: translate('tooltipMenuApp.configSub'),
  config: {
    configAQI: translate('tooltipMenuApp.config.configAQI'),
    configWQI: translate('tooltipMenuApp.config.configWQI'),
    stationAuto: translate('tooltipMenuApp.config.stationAuto'),
    stationAutoConnection: translate(
      'tooltipMenuApp.config.stationAutoConnection'
    ),
    sendNotification: translate('tooltipMenuApp.config.sendNotification'),
    sampling: translate('tooltipMenuApp.config.sampling'),
    color: translate('tooltipMenuApp.config.color'),
    camera: translate('tooltipMenuApp.config.camera'),
    parameter: translate('tooltipMenuApp.config.parameter'),
    stationType: translate('tooltipMenuApp.config.stationType'),
    site: translate('tooltipMenuApp.config.site'),
    standard: translate('tooltipMenuApp.config.standard'),
    role: translate('tooltipMenuApp.config.role'),
    user: translate('tooltipMenuApp.config.user'),
    dataLogger: translate('tooltipMenuApp.config.dataLogger'),
  },
}
