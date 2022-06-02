import CalculateApi from 'api/CalculateApi'

export const SELECT_ALARM = 'SELECT_ALARM'
export const CLEAR_ALARM_SELECTED = 'CLEAR_ALARM_SELECTED'
export const SELECT_STATION = 'SELECT_STATION'
export const GET_ALARMS = 'GET_ALARMS'
export const CREATE_ALARM = 'CREATE_ALARM'
export const DELETE_ALARM = 'DELETE_ALARM'
export const SUBMIT_ALARM = 'SUBMIT_ALARM'
export const UPDATE_DETAIL_ALARM = 'UPDATE_DETAIL_ALARM'
export const CREATE_LIST_ALARM = 'CREATE_LIST_ALARM'

export const selectAlarm = (alarm, alarmType) => {
  return {
    type: SELECT_ALARM,
    payload: { alarm, alarmType },
  }
}

export const selectStation = stationId => {
  return {
    type: SELECT_STATION,
    payload: stationId,
  }
}

export const clearAlarmSelected = () => {
  return {
    type: CLEAR_ALARM_SELECTED,
  }
}

export const getAlarms = () => async dispatch => {
  const alarms = await CalculateApi.getAlarms()

  dispatch({
    type: GET_ALARMS,
    payload: alarms,
  })
}

export const createAlarm = alarm => ({
  type: CREATE_ALARM,
  payload: alarm,
})

export const deleteAlarm = alarmId => ({
  type: DELETE_ALARM,
  payload: alarmId,
})

export const updateDetailAlarm = alarm => ({
  type: UPDATE_DETAIL_ALARM,
  payload: alarm,
})

export const createListAlarm = alarmList => {
  return {
    type: CREATE_LIST_ALARM,
    payload: alarmList,
  }
}
