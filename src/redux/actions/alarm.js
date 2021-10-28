export const SELECT_ALARM = 'SELECT_ALARM'
export const CLEAR_ALARM_SELECTED = 'CLEAR_ALARM_SELECTED'
export const SELECT_STATION = 'SELECT_STATION'

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
