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
