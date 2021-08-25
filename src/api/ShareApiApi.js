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
  getPeriodicForecastNewest: () => `${prefixCal()}/share-api/periodical-forecast/newest-data`,
  getPeriodicForecastHistory: () => `${prefixCal()}/share-api/periodical-forecast/history-data`,
}

export const dataShareApiApi = {
  getPeriodicHistory: params => {
    let route = dataRoutes.getPeriodicHistory()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getPeriodicNewest: params => {
    let route = dataRoutes.getPeriodicNewest()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getPeriodicWQIHistory: params => {
    let route = dataRoutes.getPeriodicWQIHistory()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getPeriodicWQINewest: params => {
    let route = dataRoutes.getPeriodicWQINewest()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getStationAutoHistory: params => {
    let route = dataRoutes.getStationAutoHistory()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getStationAutoNewest: params => {
    let route = dataRoutes.getStationAutoNewest()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getWeatherNewest: params => {
    let route = dataRoutes.getWeatherNewest()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getWeatherFuture: params => {
    let route = dataRoutes.getWeatherFuture()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getPeriodicForecastNewest: params => {
    let route = dataRoutes.getPeriodicForecastNewest()
    route = route.replace('share-api/', '')
    return getFetch(route, params)
  },

  getPeriodicForecastHistory: params => {
    let route = dataRoutes.getPeriodicForecastHistory()
    route = route.replace('share-api/', '')
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
