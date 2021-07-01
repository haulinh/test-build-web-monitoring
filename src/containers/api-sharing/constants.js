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

export const API_SHARE_LIST_DATA = {
  data: {
    _id: '60da8be350dd14506e73f624',
    key: 'shared-api',
    name: 'Chia sẻ API',
    value: [
      {
        group: 'station-management',
        name: {
          vi: 'Quản lý Trạm quan trắc',
          en: 'Quản lý Trạm quan trắc',
        },
        api: [
          {
            key: 'station-auto',
            name: {
              vi: 'Danh sách trạm tự động',
              en: 'Danh sách trạm tự động',
            },
          },
          {
            key: 'station-fixed',
            name: {
              vi: 'Danh sách trạm cố định',
              en: 'Danh sách trạm cố định',
            },
          },
          {
            key: 'aqi-station-auto',
            name: {
              vi: 'Trạm tự động có AQI',
              en: 'Trạm tự động có AQI',
            },
          },
          {
            key: 'wqi-station-fixed',
            name: {
              vi: 'Trạm cố định có WQI',
              en: 'Trạm cố định có WQI',
            },
          },
        ],
      },
      {
        group: 'data-station-auto',
        name: {
          vi: 'Dữ liệu trạm tự động',
          en: 'Dữ liệu trạm tự động',
        },
        api: [
          {
            key: 'newest-data',
            name: {
              vi: 'Dữ liệu mới nhất',
              en: 'Dữ liệu mới nhất',
            },
          },
          {
            key: 'history-data',
            name: {
              vi: 'Dữ liệu lịch sử',
              en: 'Dữ liệu lịch sử',
            },
          },
          {
            key: 'average-data',
            name: {
              vi: 'Dữ liệu trung bình',
              en: 'Dữ liệu trung bình',
            },
          },
        ],
      },
    ],
  },
  success: true,
}

export const API_KEY_LIST = {
  'station-auto': [
    {
      id: '1',
      name: 'Danh sách trạm TP HCM',
      createdAt: '21/06/2021',
      updatedAt: '22/06/2021',
    },
    {
      id: '2',
      name: 'Danh sách trạm Ha Noi',
      createdAt: '21/06/2021',
      updatedAt: '22/06/2021',
    },
    {
      id: '3',
      name: 'Danh sách trạm Binh Duong',
      createdAt: '21/06/2021',
      updatedAt: '22/06/2021',
    },
    {
      id: '4',
      name: 'Danh sách trạm TP HCM',
      createdAt: '21/06/2021',
      updatedAt: '22/06/2021',
    },
  ],
  'station-fixed': [
    {
      id: '1',
      name: 'Danh sách trạm 1',
      createdAt: '21/06/2021',
      updatedAt: '22/06/2021',
    },
    {
      id: '2',
      name: 'Danh sách trạm 2',
      createdAt: '21/06/2021',
      updatedAt: '22/06/2021',
    },
    {
      id: '3',
      name: 'Danh sách trạm 3',
      createdAt: '21/06/2021',
      updatedAt: '22/06/2021',
    },
    {
      id: '4',
      name: 'Danh sách trạm 4',
      createdAt: '21/06/2021',
      updatedAt: '22/06/2021',
    },
  ],
}
