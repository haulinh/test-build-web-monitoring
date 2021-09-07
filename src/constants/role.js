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
    VIEW: 'menu.dashboard.actions.view',
  },
  DASHBOARD_2: {
    VIEW: 'menu.dashboard_2.actions.view',
  },
  MONITORING: {
    VIEW: 'menu.monitoring.actions.view',
    CONTROL: 'menu.monitoring.actions.control',
    CAMERA: 'menu.monitoring.actions.camera',
    CHART: 'menu.monitoring.actions.chart',
    MAP: 'menu.monitoring.actions.map',
    IMAGES: 'menu.monitoring.actions.images',
    INFOSTATION: 'menu.monitoring.actions.infoStation',
    REVIEWSTATION: 'menu.monitoring.actions.reviewStation',
  },
  MONITORING_BY_LIST: {
    VIEW: 'menu.monitorByList.actions.view',
  },
  MAP: {
    VIEW: 'menu.map.actions.view',
  },
  CAMERA: {
    VIEW: 'menu.camera.actions.view',
  },
  CHART: {
    VIEW: 'menu.chart.actions.view',
    EXPORT: 'menu.chart.actions.export',
  },
  DATA_SEARCH: {
    VIEW: 'menu.dataSearch.actions.view',
    EXPORT: 'menu.dataSearch.actions.export',
  },
  AVG_SEARCH: {
    VIEW: 'menu.avgSearch.actions.view',
    EXPORT: 'menu.avgSearch.actions.export',
  },
  REPORT: {
    VIEW: 'menu.report.actions.view',
  },

  XU_LY_KIEM_DUYET_DU_LIEU_CONFIG: {
    VIEW: 'menu.xuLyDuLieu_config.actions.view',
    EDIT: 'menu.xuLyDuLieu_config.actions.edit',
  },
  XU_LY_KIEM_DUYET_DU_LIEU: {
    VIEW: 'menu.kiemDuyetDuLieu.actions.view',
  },
  PERIODICAL_STATION: {
    VIEW: 'menu.periodicalStation.actions.view',
    CREATE: 'menu.periodicalStation.actions.create',
    EDIT: 'menu.periodicalStation.actions.edit',
    DELETE: 'menu.periodicalStation.actions.delete',
  },
  PERIODICAL_IMPORT_DATA: {
    VIEW: 'menu.periodicalImportStation.actions.view',
  },
  PERIODICAL_SEARCH_DATA: {
    VIEW: 'menu.periodicalSeachData.actions.view',
    EXPORT: 'menu.periodicalSeachData.actions.export',
  },
  QAQCCONFIG: {
    VIEW: 'menu.qaqcConfig.actions.view',
  },
  SHARE_API: {
    VIEW: 'menu.shareAPI.actions.view',
    EDIT: 'menu.shareAPI.actions.edit',
    DELETE: 'menu.shareAPI.actions.delete',
    CREATE: 'menu.shareAPI.actions.create',
  },
  XU_LY_DU_LIEU_CAU_HINH: {
    VIEW: 'menu.xuLyDuLieu_config.actions.view',
    EDIT: 'menu.xuLyDuLieu_config.actions.edit',
  },
  FTPTRANSFER: {
    VIEW: 'menu.ftpTransfer.actions.view',
  },
  TILE_DULIEU_THUDUOC: {
    VIEW: 'menu.tiLeDuLieuThuDuoc.actions.view',
    EXPORT: 'menu.tiLeDuLieuThuDuoc.actions.export',
  },
  TB24H: {
    VIEW: 'menu.tb24H.actions.view',
    EXPORT: 'menu.tb24H.actions.export',
  },
  TB1H: {
    VIEW: 'menu.tb1H.actions.view',
    EXPORT: 'menu.tb1H.actions.export',
  },
  TB1MAX: {
    VIEW: 'menu.tb1HMax.actions.view',
    EXPORT: 'menu.tb1HMax.actions.export',
  },
  TB8MAX: {
    VIEW: 'menu.tb8HMax.actions.view',
    EXPORT: 'menu.tb8HMax.actions.export',
  },
  TILE_DULIE_VUOTNGUONG: {
    VIEW: 'menu.tileDuLieuVuotNguong.actions.view',
    EXPORT: 'menu.tileDuLieuVuotNguong.actions.export',
  },
  SO_LAN_MAT_KET_NOI: {
    VIEW: 'menu.soLanMatKetNoi.actions.view',
  },
  AQI: {
    VIEW: 'menu.aqiMap.actions.view',
  },
  AQI_GIO: {
    VIEW: 'menu.aqiGio.actions.view',
    AQI_GIO_EXPORT: 'menu.aqiGio.actions.export',
  },
  AQI_NGAY: {
    VIEW: 'menu.aqiNgay.actions.view',
    AQI_NGAY_EXPORT: 'menu.aqiGio.actions.export',
  },
  TINH_TRANG_DU_LIEU: {
    VIEW: 'menu.tinhTrangDuLieu.actions.view',
    EXPORT: 'menu.tinhTrangDuLieu.actions.export',
  },
  WQI_GIO: {
    VIEW: 'menu.wqiGio.actions.view',
    WQI_GIO_EXPORT: 'menu.wqiGio.actions.export',
  },
  WQI_NGAY: {
    VIEW: 'menu.wqiNgay.actions.view',
    WQI_NGAY_EXPORT: 'menu.wqiNgay.actions.export',
  },
  WQI_PERIODIC: {
    VIEW: 'menu.wqiPeriodic.actions.view',
    WQI_PERIODIC_EXPORT: 'menu.wqiPeriodic.actions.export',
  },
  WQI: {
    VIEW: 'menu.wqiMap.actions.view',
  },
  CONFIG_WQI: {
    VIEW: 'menu.configWQI.actions.view',
    EDIT: 'menu.configWQI.actions.edit',
  },
  STATION_AUTO: {
    VIEW: 'menu.stationAuto.actions.view',
    CREATE: 'menu.stationAuto.actions.create',
    EDIT: 'menu.stationAuto.actions.edit',
    DELETE: 'menu.stationAuto.actions.delete',
    CONFIG: 'menu.stationAuto.actions.config',
  },
  CAU_HINH_KET_NOI: {
    VIEW: 'menu.cauHinhKetNoi.actions.view',
    FTP_FLODER: 'menu.cauHinhKetNoi.actions.fTPFloder',
    FILE_MAPPING: 'menu.cauHinhKetNoi.actions.fileMapping',
  },
  CAU_HINH_GUI_CANH_BAO: {
    VIEW: 'menu.cauHinhGuiCanhBao.actions.view',
  },
  CAU_HINH_LAY_MAU: {
    VIEW: 'menu.cauHinhLayMau.actions.view',
  },
  CAU_HINH_TINH_TOAN_AQI: {
    VIEW: 'menu.cauHinhTinhToanAQI.actions.view',
  },
  CAU_HINH_TINH_TOAN_WQI: {
    VIEW: 'menu.cauHinhTinhToanWQI.actions.view',
  },
  CAU_HINH_CAMERA: {
    VIEW: 'menu.cauHinhCamera.actions.view',
  },
  MEASURING: {
    VIEW: 'menu.measuring.actions.view',
    CREATE: 'menu.measuring.actions.create',
    EDIT: 'menu.measuring.actions.edit',
    DELETE: 'menu.measuring.actions.delete',
  },
  STATION_TYPE: {
    VIEW: 'menu.stationType.actions.view',
    CREATE: 'menu.stationType.actions.create',
    EDIT: 'menu.stationType.actions.edit',
    DELETE: 'menu.stationType.actions.delete',
  },
  PROVINCE: {
    VIEW: 'menu.province.actions.view',
    CREATE: 'menu.province.actions.create',
    EDIT: 'menu.province.actions.edit',
    DELETE: 'menu.province.actions.delete',
  },
  QCVN: {
    VIEW: 'menu.qcvn.actions.view',
    CREATE: 'menu.qcvn.actions.create',
    EDIT: 'menu.qcvn.actions.edit',
    DELETE: 'menu.qcvn.actions.delete',
  },
  ROLE: {
    VIEW: 'menu.role.actions.view',
    CREATE: 'menu.role.actions.create',
    EDIT: 'menu.role.actions.edit',
    DELETE: 'menu.role.actions.delete',
  },
  USER: {
    VIEW: 'menu.user.actions.view',
    CREATE: 'menu.user.actions.create',
    EDIT: 'menu.user.actions.edit',
    DELETE: 'menu.user.actions.delete',
    ROLE: 'menu.user.actions.role',
    ENABLE_ACCOUNT: 'menu.user.actions.enableAccount',
  },
  CONFIG_COLOR_NOTI: {
    VIEW: 'menu.config_color_noti.actions.view',
    EDIT: 'menu.config_color_noti.actions.edit',
  },
  XEM_NHAT_KY: {
    VIEW: 'menu.xem_Nhat_ky.actions.view',
  },

  /* #region   */

  QAQC: {
    VIEW: 'menu.qaqc.actions.view',
    MANUAL_APPROVE: 'menu.qaqc.actions.manualapprove',
    UN_APPROVE: 'menu.qaqc.actions.unapprove',
    APPROVE: 'menu.qaqc.actions.approve',
    RESTORE: 'menu.qaqc.actions.restore',
    REMOVE: 'menu.qaqc.actions.remove',
    CONFIG_PUBLISH: 'menu.qaqc.actions.config_publish',
    CONFIG_NEW: 'menu.qaqc.action.configNew',
  },
  SERVICE_CONFIG: {
    VIEW: 'menu.service_config.actions.view',
    SETUP: 'menu.service_config.actions.setup',
  },
  AQI_SEARCHDATA: {
    VIEW: 'menu.aqiSearchData.actions.view',
    AQI_EXPORT: 'menu.aqiSearchData.actions.aqi_export',
  },

  WQI_SEARCHDATA: {
    VIEW: 'menu.wqiSearchData.actions.view',
    WQI_EXPORT: 'menu.wqiSearchData.actions.aqi_export',
  },
  STATISTIC: {
    PER_REC_DATA: 'menu.statistic.actions.per_received_data',
    PER_REC_DATA_EXPORT: 'menu.statistic.actions.per_received_data_export',
  },

  STATION_FIXED_PHASE: {
    VIEW: 'menu.stationFixPhase.actions.view',
    CREATE: 'menu.stationFixPhase.actions.create',
    EDIT: 'menu.stationFixPhase.actions.edit',
    DELETE: 'menu.stationFixPhase.actions.delete',
  },

  STATION_FIXED: {
    VIEW: 'menu.stationFix.actions.view',
    CREATE: 'menu.stationFix.actions.create',
    EDIT: 'menu.stationFix.actions.edit',
    DELETE: 'menu.stationFix.actions.delete',
  },
  STATION_FIXED_INPUT: {
    VIEW: 'menu.stationFixInput.actions.view',
  },
  STATION_FIXED_SEARCH: {
    VIEW: 'menu.stationFixData.actions.view',
    EXPORT: 'menu.stationFixData.actions.export',
  },
  MAP_STATION_FIXED: {
    VIEW: 'menu.stationFixMap.actions.view',
  },

  /* #endregion */
}
