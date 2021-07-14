import _ from 'lodash'
import { getAuthToken } from 'utils/auth'

export function isView(rule) {
  return rule === 'view'
}

export function isEdit(rule) {
  return rule === 'edit'
}

export function isCreate(rule) {
  return rule === 'create'
}

export function generateGetUrl(url) {
  const accessToken = getAuthToken()

  return `curl '${url}' \
            -H 'authorization: ${accessToken}'`
}

export const getMeasuringListFromStationAutos = stationAutos => {
  const measureList = stationAutos.reduce(
    (base, current) => [...base, ...current.measuringList],
    []
  )
  return _.uniqBy(measureList, 'key')
}

export const getPathname = location => {
  return location.pathname.split('/')[2]
}

export const getRouteList = location => {
  const pathname = location.pathname
    .split('/')
    .slice(0, 3)
    .join('/')
  return pathname
}

export const getDataExample = (menuApiSharingList, location) => {
  const pathname = getPathname(location)

  const dataGroup = menuApiSharingList.find(item =>
    pathname.includes(item.group)
  )

  const dataExample = dataGroup.api.find(item => item.key === pathname).example
  return dataExample
}

export const getFieldsDefault = data => {
  const fieldsDefault = _.get(data, 'config', []).filter(item => item.isDefault)
  return _.keyBy(fieldsDefault, 'fieldName')
}
