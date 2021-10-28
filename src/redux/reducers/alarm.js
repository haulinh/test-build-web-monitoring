import {
  CLEAR_ALARM_SELECTED,
  SELECT_ALARM,
  SELECT_STATION,
} from '../actions/alarm'

const initialState = {
  alarmSelected: {},
  alarmType: '',
  isEdit: false,
  stationIdSelected: '',
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
      console.log('run clear')
      return { ...state, alarmSelected: {}, isEdit: false }
    case SELECT_STATION:
      return { ...state, stationIdSelected: action.payload }
    default:
      return state
  }
}

export default alarmReducer
