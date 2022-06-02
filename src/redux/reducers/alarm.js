import {
  CLEAR_ALARM_SELECTED,
  CREATE_ALARM,
  GET_ALARMS,
  SELECT_ALARM,
  SELECT_STATION,
  DELETE_ALARM,
  UPDATE_DETAIL_ALARM,
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
    case SELECT_ALARM: {
      return {
        ...state,
        alarmSelected: action.payload.alarm,
        alarmType: action.payload.alarmType,
        isEdit: true,
      }
    }

    case CLEAR_ALARM_SELECTED: {
      return {
        ...state,
        alarmSelected: {},
        isEdit: false,
        stationIdSelected: '',
      }
    }

    case SELECT_STATION: {
      return { ...state, stationIdSelected: action.payload }
    }

    case GET_ALARMS: {
      return { ...state, alarmList: action.payload }
    }

    case CREATE_ALARM: {
      return {
        ...state,
        alarmList: [...state.alarmList, action.payload],
      }
    }

    case DELETE_ALARM: {
      return {
        ...state,
        alarmList: state.alarmList.filter(
          alarm => alarm._id !== action.payload
        ),
      }
    }

    case UPDATE_DETAIL_ALARM: {
      const indexFind = state.alarmList.findIndex(
        alarm => alarm._id === action.payload._id
      )

      let newAlarmDetailList = [...state.alarmList]
      newAlarmDetailList[indexFind] = action.payload

      return {
        ...state,
        alarmList: newAlarmDetailList,
      }
    }

    default:
      return state
  }
}

export default alarmReducer
