import { translate as t } from 'hoc/create-lang'

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
    newestWqi: {
      key: 'data-station-fixed-newest-wqi',
    },
    historyWqi: {
      key: 'data-station-fixed-history-wqi',
    },
  },
  weather: {
    newestData: {
      key: 'weather-newest-data',
    },
    featureData: {
      key: 'weather-feature',
    },
  },
}

export const i18n = {
  titleMenu: {
    'data-station-auto-newest-data': 'Dữ liệu mới nhất',
    'data-station-auto-history-data': 'Dữ liệu lịch sử',
    'data-station-fixed-newest-data': 'Dữ liệu mới nhất',
    'data-station-fixed-history-data': 'Dữ liệu lịch sử',
    'data-station-fixed-newest-wqi': 'Dữ liệu WQI mới nhất',
    'data-station-fixed-history-wqi': 'Dữ liệu WQI lịch sử',
    'weather-newest-data': 'Thời tiết hiện tại',
    'weather-feature': 'Dự báo thời tiết',
    create: 'Tạo mới',
    edit: 'Sửa',
  },
  detailPage: {
    header: {
      generalInfo: t('apiSharingNew.detailPage.header.generalInfo'),
      condition: t('apiSharingNew.detailPage.header.condition'),
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
      city: 'Tỉnh/Thành phố',
      country: 'Quốc gia',
      paramenter: 'Các thông số thời tiết',
      days: 'Số ngày dự báo',
      chooseCondition: 'Chọn điều kiện',
    },
  },
  button: {
    save: 'Lưu',
    search: 'Tìm kiếm',
  },
  tab: {
    configTab: 'Cấu hình',
    viewDataTab: 'Truy vấn dữ liệu',
    list: 'Danh sách',
    example: 'Ví dụ',
  },
  fields: {
    stationFixed: {
      stationKeys: 'Điểm quan trắc',
    },
    province: 'Đơn vị quản lý',
    stationType: 'Loại trạm',
    stationAuto: 'Trạm quan trắc',
    measuringList: 'Các thông số quan trắc',
    dataType: 'Loại dữ liệu',
    isExceeded: 'Vượt ngưỡng',
    rangeTime: 'Thời gian',
    stationKeys: 'Trạm quan trắc',
    phaseIds: 'Đợt quan trắc',
    cityId: 'Tỉnh/Thành phố',
    parameterList: 'Các thông số thời tiết',
    days: 'Số ngày dự báo',
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
    cityId: 'string',
    parameterList: 'string',
    days: 'number',
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
    cityId: 'Mã tỉnh thành phố',
    parameterList: 'Mã thông số thời tiết',
    days: 'Số ngày dự báo',
  },
  table: {
    tt: 'TT',
    time: 'Thời gian Truyền File',
    stationName: 'Tên trạm',
    pointName: 'Tên điểm',
    phaseName: 'Tên đợt',
    timeWeather: 'Thời gian',
  },
  message: {
    create: 'Tạo thành công',
    edit: 'Cập nhập thành công ',
    delete: 'Xóa thành công',
  },
  rules: {
    name: 'Vui lòng nhập tên API',
    max: 'Không được nhập quá 64 ký tự',
    requireChoose: 'Vui lòng chọn ít nhất 1 giá trị',
  },
  init: {
    country: 'Việt Nam',
  },
  windDirection: {
    east: 'Đông',
    west: 'Tây',
    south: 'Nam',
    north: 'Bắc',
    southeast: 'Đông Nam',
    northeast: 'Đông Bắc',
    southwest: 'Tây Nam',
    northwest: 'Tây Bắc',
    'east-southeast': 'Đông - Đông Nam',
    'east-northeast': 'Đông - Đông Bắc',
    'east-southwest': 'Đông - Tây Nam',
    'east-northwest': 'Đông - Tây Bắc',
    'west-southeast': 'Tây - Đông Nam',
    'west-northeast': 'Tây - Đông Bắc',
    'west-southwest': 'Tây - Tây Nam',
    'west-northwest': 'Tây - Tây Bắc',
    'south-southeast': 'Nam - Đông Nam',
    'south-northeast': 'Nam - Đông Bắc',
    'south-southwest': 'Nam - Tây Nam',
    'south-northwest': 'Nam - Tây Bắc',
    'north-southeast': 'Bắc - Đông Nam',
    'north-northeast': 'Bắc - Đông Bắc',
    'north-southwest': 'Bắc - Tây Nam',
    'north-northwest': 'Bắc - Tây Bắc',
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
  WEATHER: {
    PARAMNETER: 'parameterList',
    DAYS: 'days',
  },
}
