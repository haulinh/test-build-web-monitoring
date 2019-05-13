/**
 *
 * @param {*} role  ví dụ: 'menu.monitoring.actions.chart'
 * @param {*} userInfo ví dụ: state.auth.userInfo Lấy trong redux
 */
const objectPath = require('object-path')
export function checkRolePriority(userInfo, role) {
  // check role in organization first
  let isRole = objectPath.get(userInfo.organization, role)
  if (!isRole) {
    return isRole
  } else if (userInfo.isAdmin) {
    return true
  } else {
    return objectPath.get(userInfo.role, role)
  }
}

export default {
  DASHBOARD: {
    VIEW: 'menu.dashboard.actions.view'
  },
  MONITORING: {
    VIEW: 'menu.monitoring.actions.view',
    CONTROL: 'menu.monitoring.actions.control',
    CAMERA: 'menu.monitoring.actions.camera',
    CHART: 'menu.monitoring.actions.chart',
    MAP: 'menu.monitoring.actions.map',
    IMAGES: 'menu.monitoring.actions.images',
    INFOSTATION : 'menu.monitoring.actions.infoStation',
    REVIEWSTATION :'menu.monitoring.actions.reviewStation',
  },
  MAP: {
    VIEW: 'menu.map.actions.view'
  },
  CAMERA:{
    VIEW: 'menu.camera.actions.view',
  },
  DATA_SEARCH: {
    VIEW: 'menu.dataSearch.actions.view',
    EXPORT: 'menu.dataSearch.actions.export'
  },
  AVG_SEARCH: {
    VIEW: 'menu.avgSearch.actions.view',
    EXPORT: 'menu.avgSearch.actions.export'
  },
  REPORT: {
    VIEW: 'menu.report.actions.view'
  },
  QAQCCONFIG: {
    VIEW: 'menu.qaqcConfig.actions.view'
    // CREATE: 'menu.ftpTransfer.actions.create',
    // EDIT: 'menu.ftpTransfer.actions.edit',
    // DELETE: 'menu.ftpTransfer.actions.delete'
  },
  FTPTRANSFER: {
    VIEW: 'menu.ftpTransfer.actions.view'
    // CREATE: 'menu.ftpTransfer.actions.create',
    // EDIT: 'menu.ftpTransfer.actions.edit',
    // DELETE: 'menu.ftpTransfer.actions.delete'
  },


  QAQC: {
    VIEW: 'menu.qaqc.actions.view',
    MANUAL_APPROVE: 'menu.qaqc.actions.manualapprove',
    UN_APPROVE: 'menu.qaqc.actions.unapprove',
    APPROVE: 'menu.qaqc.actions.approve',
    RESTORE: 'menu.qaqc.actions.restore',
    REMOVE: 'menu.qaqc.actions.remove',
    CONFIG_PUBLISH: 'menu.qaqc.actions.config_publish'
  },
  AQI: {
    VIEW: 'menu.aqiMap.actions.view'
  },
  AQI_SEARCHDATA:{
    VIEW:'menu.aqiSearchData.actions.view',
    AQI_EXPORT:'menu.aqiSearchData.actions.aqi_export'
  },
  WQI: {
    VIEW: 'menu.wqiMap.actions.view'
  },
  WQI_SEARCHDATA:{
    VIEW:'menu.wqiSearchData.actions.view',
    WQI_EXPORT:'menu.wqiSearchData.actions.aqi_export'
  },
  STATISTIC: {
    PER_REC_DATA: 'menu.statistic.actions.per_received_data',
    PER_REC_DATA_EXPORT: 'menu.statistic.actions.per_received_data_export',
  },
  MEASURING: {
    VIEW: 'menu.measuring.actions.view',
    CREATE: 'menu.measuring.actions.create',
    EDIT: 'menu.measuring.actions.edit',
    DELETE: 'menu.measuring.actions.delete'
  },
  STATION_TYPE: {
    VIEW: 'menu.stationType.actions.view',
    CREATE: 'menu.stationType.actions.create',
    EDIT: 'menu.stationType.actions.edit',
    DELETE: 'menu.stationType.actions.delete'
  },
  STATION_AUTO: {
    VIEW: 'menu.stationAuto.actions.view',
    CREATE: 'menu.stationAuto.actions.create',
    EDIT: 'menu.stationAuto.actions.edit',
    DELETE: 'menu.stationAuto.actions.delete',
    CONFIG: 'menu.stationAuto.actions.config'
  },
  STATION_FIXED: {
    VIEW: 'menu.stationFixed.actions.view',
    CREATE: 'menu.stationFixed.actions.create',
    EDIT: 'menu.stationFixed.actions.edit',
    DELETE: 'menu.stationFixed.actions.delete'
  },
  CONFIG_WQI: {
    VIEW: 'menu.configWQI.actions.view'
  },
  USER: {
    VIEW: 'menu.user.actions.view',
    CREATE: 'menu.user.actions.create',
    EDIT: 'menu.user.actions.edit',
    DELETE: 'menu.user.actions.delete',
    ROLE: 'menu.user.actions.role',
    ENABLE_ACCOUNT: 'menu.user.actions.enableAccount'
  },
  ROLE: {
    VIEW: 'menu.role.actions.view',
    CREATE: 'menu.role.actions.create',
    EDIT: 'menu.role.actions.edit',
    DELETE: 'menu.role.actions.delete'
  },
  
  QCVN: {
    VIEW: 'menu.qcvn.actions.view',
    CREATE: 'menu.qcvn.actions.create',
    EDIT: 'menu.qcvn.actions.edit',
    DELETE: 'menu.qcvn.actions.delete'
  },
  PROVINCE: {
    VIEW: 'menu.province.actions.view',
    CREATE: 'menu.province.actions.create',
    EDIT: 'menu.province.actions.edit',
    DELETE: 'menu.province.actions.delete'
  },
  STATION_FIXED_SEARCH: {
    VIEW: 'menu.dataSearchFixed.actions.view',
    DOWNLOAD: 'menu.dataSearchFixed.actions.download',
    IMPORT: 'menu.dataSearchFixed.actions.import',
    EXPORT: 'menu.dataSearchFixed.actions.export'
  },
  MAP_STATION_FIXED: {
    VIEW: 'menu.mapStationFixed.actions.view'
  },
  
}
