import { message } from 'antd'
import CalculateApi from 'api/CalculateApi'
import CategoryApi from 'api/CategoryApi'
import StationAutoApi from 'api/StationAuto'
import { translate } from 'hoc/create-lang'
import update from 'immutability-helper'
import { get, keyBy } from 'lodash'

//#region Measure
export const GET_MEASURES = 'GET_MEASURES'
export const UPDATE_MEASURE = 'UPDATE_MEASURE'
export const CREATE_MEASURE = 'CREATE_MEASURE'
export const DELETE_MEASURE = 'DELETE_MEASURE'

export const getMeasuresAsync = () => async dispatch => {
  const measures = await CategoryApi.getMeasurings(
    {
      page: 1,
      itemPerPage: Number.MAX_SAFE_INTEGER,
    },
    {}
  )
  const measuresObj = keyBy(measures.data, 'key')
  dispatch({
    type: GET_MEASURES,
    payload: measuresObj,
  })
}

export const updateMeasure = measureUpdate => ({
  type: UPDATE_MEASURE,
  payload: measureUpdate,
})

export const createMeasure = measure => ({
  type: CREATE_MEASURE,
  payload: measure,
})

export const deleteMeasure = measureKey => ({
  type: DELETE_MEASURE,
  payload: measureKey,
})
//#endregion

//#region station autos
export const GET_STATION_AUTOS = 'GET_STATION_AUTOS'
export const UPDATE_STATION_AUTOS = 'UPDATE_STATION_AUTOS'
export const TOGGLE_SEND_ALARM = 'TOGGLE_SEND_ALARM'

//#region selectors
export const selectStationAutos = state =>
  Object.values(state.global.stationAutosObj)

export const selectStationById = (state, stationId) =>
  get(state, ['global', 'stationAutosObj', stationId], {})

export const isAlarmStatusStationEnable = (state, stationId) => {
  const station = selectStationById(state, stationId)
  return get(station, 'alarmConfig.status') === 'enable'
}

export const selectStationGroupByType = state => {
  const stationAutosGroupByType = selectStationAutos(state).reduce(
    (base, current) => {
      const stationType = get(current, ['stationType'])
      const stationTypeKey = stationType.key

      if (base[stationTypeKey]) {
        return update(base, {
          [stationTypeKey]: {
            stationAutoList: {
              $push: [current],
            },
          },
        })
      }

      return update(base, {
        [stationTypeKey]: {
          $set: {
            stationTypeKey,
            stationTypeName: stationType.name,
            stationAutoList: [current],
          },
        },
      })
    },
    {}
  )

  return stationAutosGroupByType
}
//#endregion selectors

//#region actions
export const getStationAutos = () => async dispatch => {
  const response = await StationAutoApi.getStationAutos({
    page: 1,
    itemPerPage: Infinity,
  })

  if (response.success) {
    const stationAutosObj = keyBy(response.data, '_id')
    dispatch({ type: GET_STATION_AUTOS, payload: stationAutosObj })
  }

  return
}

export const toggleSendAlarm = (stationId, param) => async dispatch => {
  try {
    await CalculateApi.toggleSendAlarm(stationId, param)
    message.success(translate('global.saveSuccess'))
    dispatch({
      type: TOGGLE_SEND_ALARM,
      payload: {
        stationId,
        param,
      },
    })
  } catch (error) {
    console.error(error)
  }
}
//#endregion actions

//#endregion station autos
