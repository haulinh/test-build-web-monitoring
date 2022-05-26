import {
  CLEAR_ALARM_SELECTED,
  GET_ALARMS,
  SELECT_ALARM,
  SELECT_STATION,
} from '../actions/alarm'

const initialState = {
  alarmSelected: {},
  alarmType: '',
  isEdit: false,
  stationIdSelected: '',
  alarmList: [],
}

const alarmReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_ALARM:
      return {
        ...state,
        alarmSelected: action.payload.alarm,
        alarmType: action.payload.alarmType,
        isEdit: true,
      }
    case CLEAR_ALARM_SELECTED:
      return {
        ...state,
        alarmSelected: {},
        isEdit: false,
        stationIdSelected: '',
      }
    case SELECT_STATION:
      return { ...state, stationIdSelected: action.payload }
    case GET_ALARMS:
      return { ...state, alarmList: action.payload }
    default:
      return state
  }
}

export default alarmReducer
