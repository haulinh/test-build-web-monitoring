import { getConfigApi } from 'config'
import { deleteFetch, getFetch, postFetch, putFetch } from 'utils/fetch'

const prefixCategory = () => getConfigApi().category
const prefixCalculate = () => getConfigApi().calculate

const routes = {
  getConfig: () => `${prefixCategory()}/share-api/config`,
  getApiListByKey: key => `${prefixCategory()}/share-api/${key}`,
  getApiShareById: id => `${prefixCategory()}/share-api/${id}`,
  getApiDetailById: id => `${prefixCategory()}/share-api/detail/${id}`,
}

export const shareApiApi = {
  getConfig: () => {
    const route = routes.getConfig()
    return getFetch(route)
  },

  getApiListByKey: key => {
    const route = routes.getApiListByKey(key)
    return getFetch(route)
  },

  getApiDetailById: id => {
    const route = routes.getApiDetailById(id)
    return getFetch(route)
  },

  deleteApiDetailById: id => {
    const route = routes.getApiShareById(id)
    return deleteFetch(route)
  },

  updateApiDetailById: (id, params) => {
    const route = routes.getApiShareById(id)
    return putFetch(route, params)
  },

  createApiByKey: (key, params) => {
    const route = routes.getApiListByKey(key)
    return postFetch(route, params)
  },
}

const prefixCal = () => getConfigApi().calculate
export const dataRoutes = {
  getPeriodicHistory: () => `${prefixCal()}/share-api/periodic/history-data`,
  getPeriodicNewest: () => `${prefixCal()}/share-api/periodic/newest-data`,
  getPeriodicWQIHistory: () => `${prefixCal()}/share-api/periodic/history-wqi`,
  getPeriodicWQINewest: () => `${prefixCal()}/share-api/periodic/newest-wqi`,
  getStationAutoNewest: () =>
    `${prefixCal()}/share-api/station-auto/newest-data`,
  getStationAutoHistory: () =>
    `${prefixCal()}/share-api/station-auto/history-data`,
  getWeatherNewest: () => `${prefixCal()}/share-api/weather/newest-data`,
  getWeatherFuture: () => `${prefixCal()}/share-api/weather/forecast-data`,
}

export const dataShareApiApi = {
  getPeriodicHistory: params => {
    const route = dataRoutes.getPeriodicHistory()
    return getFetch(route, params)
  },

  getPeriodicNewest: params => {
    const route = dataRoutes.getPeriodicNewest()
    return getFetch(route, params)
  },

  getPeriodicWQIHistory: params => {
    const route = dataRoutes.getPeriodicWQIHistory()
    return getFetch(route, params)
  },

  getPeriodicWQINewest: params => {
    const route = dataRoutes.getPeriodicWQINewest()
    return getFetch(route, params)
  },

  getStationAutoHistory: params => {
    const route = dataRoutes.getStationAutoHistory()
    return getFetch(route, params)
  },

  getStationAutoNewest: params => {
    const route = dataRoutes.getStationAutoNewest()
    return getFetch(route, params)
  },

  getWeatherNewest: params => {
    const route = dataRoutes.getWeatherNewest()
    return getFetch(route, params)
  },

  getWeatherFuture: params => {
    const route = dataRoutes.getWeatherFuture()
    return getFetch(route, params)
  },
}

const weatherRoutes = {
  getCities: () => `${prefixCalculate()}/cities`,
}

export const weatherApi = {
  getCities: () => {
    const route = weatherRoutes.getCities()
    return getFetch(route)
  },
}
