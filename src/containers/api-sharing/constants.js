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
  head: {
    apiName: t('apiSharingNew.head.apiName'),
    dateCreated: t('apiSharingNew.head.dateCreated'),
    dateEdited: t('apiSharingNew.head.dateEdited'),
  },
  titleMenu: {
    'data-station-auto-newest-data': 'Dữ liệu mới nhất',
    'data-station-auto-history-data': 'Dữ liệu lịch sử',
    'data-station-fixed-newest-data': 'Dữ liệu mới nhất',
    'data-station-fixed-history-data': 'Dữ liệu lịch sử',
    'data-station-fixed-newest-wqi': 'Dữ liệu WQI mới nhất',
    'data-station-fixed-history-wqi': 'Dữ liệu WQI lịch sử',
    'weather-newest-data': 'Dữ liệu mới nhất',
    'weather-feature': 'Dự báo thời tiết',
  },
  detailPage: {
    header: {
      generalInfo: t('apiSharingNew.detailPage.header.generalInfo'),
      condition: t('apiSharingNew.detailPage.header.condition'),
      querySetting: t('apiSharingNew.detailPage.header.querySetting'),
      parameter: t('apiSharingNew.detailPage.header.parameter'),
    },
    label: {
      apiName: t('apiSharingNew.detailPage.label.apiName'),
      apiType: t('apiSharingNew.detailPage.label.apiType'),
      description: t('apiSharingNew.detailPage.label.description'),
      province: t('apiSharingNew.detailPage.label.province'),
      stationType: t('apiSharingNew.detailPage.label.stationType'),
      defaultParameter: t('apiSharingNew.detailPage.label.defaultParameter'),
      optionParamter: t('apiSharingNew.detailPage.label.optionParamter'),
      stationName: t('apiSharingNew.detailPage.label.stationName'),
      parameter: t('apiSharingNew.detailPage.label.parameter'),
      typeData: t('apiSharingNew.detailPage.label.typeData'),
      isExceeded: t('apiSharingNew.detailPage.label.isExceeded'),
      timeLabel: t('apiSharingNew.detailPage.label.timeLabel'),
      phase: t('apiSharingNew.detailPage.label.phase'),
      point: t('apiSharingNew.detailPage.label.point'),
      field: t('apiSharingNew.detailPage.label.field'),
      type: t('apiSharingNew.detailPage.label.type'),
      city: t('apiSharingNew.detailPage.label.city'),
      country: t('apiSharingNew.detailPage.label.country'),
      paramenter: t('apiSharingNew.detailPage.label.paramenter'),
      days: t('apiSharingNew.detailPage.label.days'),
      chooseCondition: t('apiSharingNew.detailPage.label.chooseCondition'),
    },
  },
  button: {
    save: t('apiSharingNew.button.save'),
    search: t('apiSharingNew.button.search'),
    create: t('apiSharingNew.button.create'),
    edit: t('apiSharingNew.button.edit'),
    delete: t('apiSharingNew.button.delete'),
    nodata: t('apiSharingNew.button.nodata'),
  },
  tab: {
    configTab: t('apiSharingNew.tab.configTab'),
    viewDataTab: t('apiSharingNew.tab.viewDataTab'),
    list: t('apiSharingNew.tab.list'),
    example: t('apiSharingNew.tab.example'),
  },
  fields: {
    stationFixed: {
      stationKeys: t('apiSharingNew.fields.stationFixed.stationKeys'),
    },
    province: t('apiSharingNew.fields.province'),
    stationType: t('apiSharingNew.fields.stationType'),
    stationAuto: t('apiSharingNew.fields.stationAuto'),
    measuringList: t('apiSharingNew.fields.measuringList'),
    dataType: t('apiSharingNew.fields.dataType'),
    isExceeded: t('apiSharingNew.fields.isExceeded'),
    rangeTime: t('apiSharingNew.fields.rangeTime'),
    viewBy: t('apiSharingNew.fields.viewBy'),
    stationKeys: t('apiSharingNew.fields.stationKeys'),
    phaseIds: t('apiSharingNew.fields.phaseIds'),
    cityId: t('apiSharingNew.fields.cityId'),
    parameterList: t('apiSharingNew.fields.parameterList'),
    days: t('apiSharingNew.fields.days'),
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
    province: t('apiSharingNew.detailPage.description.province'),
    stationType: t('apiSharingNew.detailPage.description.stationType'),
    stationAuto: t('apiSharingNew.detailPage.description.stationAuto'),
    measuringList: t('apiSharingNew.detailPage.description.measuringList'),
    dataType: t('apiSharingNew.detailPage.description.dataType'),
    isExceeded: t('apiSharingNew.detailPage.description.isExceeded'),
    stationKeys: t('apiSharingNew.detailPage.description.stationKeys'),
    phaseIds: t('apiSharingNew.detailPage.description.phaseIds'),
    cityId: t('apiSharingNew.detailPage.description.cityId'),
    parameterList: t('apiSharingNew.detailPage.description.parameterList'),
    days: t('apiSharingNew.detailPage.description.days'),
  },
  table: {
    tt: 'TT',
    time: t('apiSharingNew.detailPage.table.time'),
    stationName: t('apiSharingNew.detailPage.table.stationName'),
    pointName: t('apiSharingNew.detailPage.table.pointName'),
    phaseName: t('apiSharingNew.detailPage.table.phaseName'),
    timeWeather: t('apiSharingNew.detailPage.table.timeWeather'),
  },
  message: {
    create: t('apiSharingNew.detailPage.message.create'),
    edit: t('apiSharingNew.detailPage.message.edit'),
    delete: t('apiSharingNew.detailPage.message.delete'),
  },
  rules: {
    name: t('apiSharingNew.detailPage.rules.name'),
    max: t('apiSharingNew.detailPage.rules.max'),
    requireChoose: t('apiSharingNew.detailPage.rules.requireChoose'),
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
  month: t('wqiStationFix.month'),
  year: t('wqiStationFix.year'),
  quarter: t('wqiStationFix.quarter'),
  wqi: {
    viewBy: t('wqiStationFix.viewBy'),
    time: t('wqiStationFix.time'),
    requireTime: t('wqiStationFix.requireTime'),
  }
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
