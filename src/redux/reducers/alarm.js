import { CLEAR_ALARM_SELECTED, SELECT_ALARM } from '../actions/alarm'
const initialState = {
  alarmSelected: {},
  alarmType: '',
  isEdit: false,
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
      return { ...state, alarmSelected: {}, isEdit: false }
    default:
      return state
  }
}

export default alarmReducer
