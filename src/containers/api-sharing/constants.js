import { translate as t } from 'hoc/create-lang'

const i18n = {
  stationManagement: t('apiSharing.stationManagement'),
  stations: t('apiSharing.stations'),
  averageData: t('apiSharing.averageData'),
  dataHistory: t('apiSharing.dataHistory'),
  aqi: t('apiSharing.aqi'),
  stationName: t('apiSharing.stationName'),
  stationAddress: t('apiSharing.stationAddress'),
  stationTypeKey: t('apiSharing.stationTypeKey'),
  page: t('apiSharing.page'),
  itemPerPage: t('apiSharing.itemPerPage'),
  stationAutoKey: t('apiSharing.stationAutoKey'),
  measuringList: t('apiSharing.measuringList'),
  fromDate: t('apiSharing.fromDate'),
  toDate: t('apiSharing.toDate'),
  filterByExceeded: t('apiSharing.filterByExceeded'),
  allowedAQI: t('apiSharing.allowedAQI'),
}

export const PublicApis = {
  StationManagement: {
    key: 'StationManagement',
    name: i18n.stationManagement,
    endpoints: {
      stations: {
        key: 'stations',
        name: i18n.stations,
        method: 'get',
        endpoint: '/station-auto/all',
        parameters: [
          {
            field: 'name',
            type: 'string',
            description: i18n.stationName,
          },
          {
            field: 'address',
            type: 'string',
            description: i18n.stationAddress,
          },
          {
            field: 'stationType',
            type: 'string',
            description: i18n.stationTypeKey,
          },
          {
            field: 'page',
            type: 'number',
            description: i18n.page,
          },
          {
            field: 'itemPerPage',
            type: 'number',
            description: i18n.itemPerPage,
          },
        ],
        responseFormat: {
          success: 'boolean',
          pagination: {
            page: 'number',
            maxIndex: 'number',
            itemPerPage: 'number',
            minIndex: 'number',
            totalItem: 'number',
          },
          data: [
            {
              _id: 'string',
              key: 'string',
              address: 'string',
              name: 'string',
              dataFrequency: 'number',
              activatedAt: 'datetime',
              status: 'string',
              latestDeviceStatus: 'string',
              stationStatus: 'string',
              lastLog: 'object',
              configLogger: 'object',
              createdAt: 'datetime',
              emails: 'string[]',
              mapLocation: {
                long: 'number',
                lat: 'number',
              },
              measuringList: 'object[]',
              note: null,
              options: 'object',
              removeStatus: 'object',
              standardsVN: null,
              stationType: 'StationType',
            },
          ],
        },
      },
      averageData: {
        key: 'averageData',
        name: i18n.averageData,
        method: 'get',
        endpoint: '/data-station-auto/{stationAutoKey}/avg',
        extraEndpoint:
          '/data-station-auto/{stationAutoKey}/avg?type=60&measuringList=pH,Temp',
        parameters: [
          {
            field: 'stationAutoKey',
            type: 'string',
            description: i18n.stationAutoKey,
          },
          {
            field: 'measuringList',
            type: 'string',
            description: i18n.measuringList,
          },
          {
            field: 'from',
            type: 'date ISO',
            description: i18n.fromDate,
          },
          {
            field: 'to',
            type: 'date ISO',
            description: i18n.toDate,
          },
          {
            field: 'page',
            type: 'number',
            description: i18n.page,
          },
          {
            field: 'itemPerPage',
            type: 'number',
            description: i18n.itemPerPage,
          },
        ],
        responseFormat: {
          success: 'boolean',
          pagination: {
            page: 'number',
            maxIndex: 'number',
            itemPerPage: 'number',
            minIndex: 'number',
            totalItem: 'number',
          },
          data: [
            {
              '[parameter]': 'number',
              date_utc: 'number',
            },
          ],
        },
      },
      dataHistory: {
        key: 'dataHistory',
        name: i18n.dataHistory,
        method: 'get',
        endpoint: '/data-station-auto/{stationAutoKey}',
        parameters: [
          {
            field: 'stationAutoKey',
            type: 'string',
            description: i18n.stationAutoKey,
          },
          {
            field: 'measuringList',
            type: 'string',
            description: i18n.measuringList,
          },
          {
            field: 'from',
            type: 'date ISO',
            description: i18n.fromDate,
          },
          {
            field: 'to',
            type: 'date ISO',
            description: i18n.toDate,
          },
          {
            field: 'isExceeded',
            type: 'boolean',
            description: i18n.filterByExceeded,
          },
          {
            field: 'page',
            type: 'number',
            description: i18n.page,
          },
          {
            field: 'itemPerPage',
            type: 'number',
            description: i18n.itemPerPage,
          },
        ],
        responseFormat: {
          success: 'boolean',
          pagination: {
            page: 'number',
            maxIndex: 'number',
            itemPerPage: 'number',
            minIndex: 'number',
            totalItem: 'number',
          },
          data: [
            {
              measuringLogs: {
                '[parameter]': {
                  approvedValue: 'number',
                  hasApproved: 'number',
                  maxLimit: 'number',
                  maxTend: 'number',
                  minLimit: 'number',
                  minTend: 'number',
                  statusDevice: 'number',
                  unit: 'string',
                  value: 'number',
                  warningLevel: 'number',
                },
              },
              createdAt: 'date',
              receivedAt: 'date',
              updatedAt: 'date',
            },
          ],
        },
      },
      aqi: {
        key: 'aqi',
        name: i18n.aqi,
        method: 'get',
        extraEndpoint: '/aqi-v1/hour-last-logs?listKey=KK_HoanKiem&locale=vn',
        endpoint: '/aqi-v1/hour-last-logs',
        parameters: [
          {
            field: 'listKey',
            type: 'string',
            description: i18n.allowedAQI,
          },
          {
            field: 'locale',
            type: 'string',
            description: 'vn',
          },
        ],
        responseFormat: {
          success: 'boolean',
          aqiLevel: [
            {
              backgroundColor: 'string',
              color: 'string',
              description: 'string',
              max: 'number',
              min: 'number',
              name: 'string',
            },
          ],
          data: [
            {
              '[stationAutoKey]': {
                aqiDay: 'number',
                aqiDayOf: {
                  '[parameter]': 'number',
                  isOK: 'boolean',
                },
                key: 'string',
                mapLocation: { long: 'number', lat: 'number' },
                name: 'string',
                time: 'date',
              },
              time: 'date',
            },
          ],
        },
      },
    },
  },
}
