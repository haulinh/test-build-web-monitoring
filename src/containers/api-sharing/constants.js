export const shareApiList = {
  stationAuto: {
    historyData: {
      key: 'data-station-auto-history-data',
    },
    newestData: {
      key: 'data-station-auto-newest-data',
    },
  },
  stationFixed: {
    historyData: {
      key: 'data-station-fixed-history-data',
    },
    newestData: {
      key: 'data-station-fixed-newest-data',
    },
  },
}

export const i18n = {
  titleMenu: {
    'data-station-auto-newest-data': 'Dữ liêu mới nhất',
    'data-station-auto-history-data': 'Dữ liêu lịch sử',
    'data-station-fixed-newest-data': 'Dữ liêu mới nhất',
    'data-station-fixed-history-data': 'Dữ liêu lịch sử',
  },
  detailPage: {
    header: {
      generalInfo: 'Thông tin chung',
      condition: 'Điều kiện',
      querySetting: 'Thiết lập truy vấn',
      parameter: 'Thông số',
    },
    label: {
      apiName: 'Tên API',
      apiType: 'Loại API',
      description: 'Mô tả',
      province: 'Đơn vị quản lý',
      stationType: 'Loại trạm',
      defaultParameter: 'Tham số mặc định',
      optionParamter: 'Tham số tùy chọn',
      stationName: 'Trạm quan trắc',
      parameter: 'Các thông số quan trắc',
      typeData: 'Loại dữ liệu',
      isExceeded: 'Vượt ngưỡng',
      timeLabel: 'Thời gian',
      phase: 'Đợt quan trắc',
      point: 'Điểm quan trắc',
      field: 'Field',
      type: 'Type',
    },
  },
  button: {
    save: 'Lưu',
  },
  tab: {
    configTab: 'Cấu hình',
    viewDataTab: 'Truy vấn dữ liệu',
  },
  fields: {
    province: 'Đơn vị quản lý',
    stationType: 'Loại trạm',
    stationAuto: 'Trạm quan trắc',
    measuringList: 'Các thông số quan trắc',
    dataType: 'Loại dữ liệu',
    isExceeded: 'Vượt ngưỡng',
    rangeTime: 'Thời gian',
    stationKeys: 'Trạm quan trắc',
    phaseIds: 'Đợt quan trắc',
  },
  types: {
    province: 'string',
    stationType: 'string',
    stationAuto: 'string',
    measuringList: 'string',
    dataType: 'string',
    isExceeded: 'boolean',
    stationKeys: 'string',
    phaseIds: 'string',
  },
  description: {
    province: 'Mã đơn vị quản lý',
    stationType: 'Mã loại trạm',
    stationAuto: 'Mã trạm quan trắc',
    measuringList: 'Mã thông số',
    dataType: 'Mã loại dữ liệu',
    isExceeded: 'Vượt ngưỡng',
    stationKeys: 'Mã trạm quan trắc',
    phaseIds: 'Mã đợt quan trắc',
  },
  message: {
    create: 'Tạo thành công',
    edit: 'Cập nhập thành công ',
  },
}

export const FIELDS = {
  STATION_FIXED: {
    HISTORY_DATA: {
      PROVINCE: 'province',
      STATION_TYPE: 'stationType',
      RANGE_TIME: 'rangeTime',
      POINT: 'stationKeys',
      MEASURING_LIST: 'measuringList',
      IS_EXCEEDED: 'isExceeded',
    },
  },
}
