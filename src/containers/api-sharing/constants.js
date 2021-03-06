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
  periodicForecast: {
    newestData: {
      key: 'data-periodical-forecast-newest-data',
    },
    historyData: {
      key: 'data-periodical-forecast-history-data',
    },
  },
}

export function i18n() {
  return {
    head: {
      apiName: t('apiSharingNew.head.apiName'),
      dateCreated: t('apiSharingNew.head.dateCreated'),
      dateEdited: t('apiSharingNew.head.dateEdited'),
    },
    menu: {
      'data-station-auto': t('apiSharingNew.menu.data-station-auto'),
      'data-station-fixed': t('apiSharingNew.menu.data-station-fixed'),
      weather: t('apiSharingNew.menu.weather'),
      'data-periodical-forecast': t(
        'apiSharingNew.menu.data-periodical-forecast'
      ),
    },
    titleMenu: {
      'data-station-auto-newest-data': t(
        'apiSharingNew.titleMenu.data-station-auto-newest-data'
      ),
      'data-station-auto-history-data': t(
        'apiSharingNew.titleMenu.data-station-auto-history-data'
      ),
      'data-station-fixed-newest-data': t(
        'apiSharingNew.titleMenu.data-station-fixed-newest-data'
      ),
      'data-station-fixed-history-data': t(
        'apiSharingNew.titleMenu.data-station-fixed-history-data'
      ),
      'data-station-fixed-newest-wqi': t(
        'apiSharingNew.titleMenu.data-station-fixed-newest-wqi'
      ),
      'data-station-fixed-history-wqi': t(
        'apiSharingNew.titleMenu.data-station-fixed-history-wqi'
      ),
      'weather-newest-data': t('apiSharingNew.titleMenu.weather-newest-data'),
      'weather-feature': t('apiSharingNew.titleMenu.weather-feature'),
      'data-periodical-forecast-newest-data': t(
        'apiSharingNew.titleMenu.data-periodical-forecast-newest-data'
      ),
      'data-periodical-forecast-history-data': t(
        'apiSharingNew.titleMenu.data-periodical-forecast-history-data'
      ),
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
        broadcastTime: t('apiSharingNew.detailPage.label.broadcastTime'),
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
      broadcastTime: t('apiSharingNew.fields.broadcastTime'),
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
      viewBy: 'string',
      days: 'number',
      broadcastTime: 'Date',
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
      viewBy: t('apiSharingNew.detailPage.description.viewBy'),
      broadcastTime: t('apiSharingNew.detailPage.description.broadcastTime'),
    },
    table: {
      tt: t('apiSharingNew.detailPage.table.tt'),
      time: t('apiSharingNew.detailPage.table.time'),
      stationName: t('apiSharingNew.detailPage.table.stationName'),
      pointName: t('apiSharingNew.detailPage.table.pointName'),
      phaseName: t('apiSharingNew.detailPage.table.phaseName'),
      timeWeather: t('apiSharingNew.detailPage.table.timeWeather'),
      date: t('apiSharingNew.detailPage.table.date'),
      dataType: t('apiSharingNew.detailPage.table.dataType'),
      measureValue: t('apiSharingNew.detailPage.table.measureValue'),
      alarmLevelI: t('apiSharingNew.detailPage.table.alarmLevelI'),
      alarmLevelII: t('apiSharingNew.detailPage.table.alarmLevelII'),
      alarmLevelIII: t('apiSharingNew.detailPage.table.alarmLevelIII'),
      dataSource: t('apiSharingNew.detailPage.table.dataSource'),
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
      requireStation: t('apiSharingNew.detailPage.rules.requireStation'),
      requireBroadcastTime: t(
        'apiSharingNew.detailPage.rules.requireBroadcastTime'
      ),
    },
    init: {
      country: 'Vi???t Nam',
    },
    windDirection: {
      east: '????ng',
      west: 'T??y',
      south: 'Nam',
      north: 'B???c',
      southeast: '????ng Nam',
      northeast: '????ng B???c',
      southwest: 'T??y Nam',
      northwest: 'T??y B???c',
      'east-southeast': '????ng - ????ng Nam',
      'east-northeast': '????ng - ????ng B???c',
      'east-southwest': '????ng - T??y Nam',
      'east-northwest': '????ng - T??y B???c',
      'west-southeast': 'T??y - ????ng Nam',
      'west-northeast': 'T??y - ????ng B???c',
      'west-southwest': 'T??y - T??y Nam',
      'west-northwest': 'T??y - T??y B???c',
      'south-southeast': 'Nam - ????ng Nam',
      'south-northeast': 'Nam - ????ng B???c',
      'south-southwest': 'Nam - T??y Nam',
      'south-northwest': 'Nam - T??y B???c',
      'north-southeast': 'B???c - ????ng Nam',
      'north-northeast': 'B???c - ????ng B???c',
      'north-southwest': 'B???c - T??y Nam',
      'north-northwest': 'B???c - T??y B???c',
    },
    month: t('wqiStationFix.month'),
    year: t('wqiStationFix.year'),
    quarter: t('wqiStationFix.quarter'),
    wqi: {
      viewBy: t('wqiStationFix.viewBy'),
      time: t('wqiStationFix.time'),
      requireTime: t('wqiStationFix.requireTime'),
    },
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

export const DATA_COLOR = {
  // GOOD: '#2CCA73',
  DATA_LOSS: '#A4A6B5',
  EXCEEDED: '#E54C3C',
  EXCEEDED_PREPARING: '#EDC30F',
}
