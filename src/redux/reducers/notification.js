import _ from 'lodash';

import { TAB_KEYS } from 'constants/notification'
import {
  GET_COUNTS,
  UPDATE_COUNTS,
  PREPEND_DATA_SOURCE,
  UPDATE_DATA_SOURCE,
  TOGGLE_LOADING,
  UPDATE_CURRENT_PAGE,
} from '../actions/notification'

const {
  EXCEEDED,
  LOST_SIGNAL,
  SENSOR_ERROR
} = TAB_KEYS


const initialState = {
  loading: true,
  defaultStartPage: 0,
  currentPage: 0,
  count: {
    total: 23,
    exceeded: 9,
    lostSignal: 55,
    sensorError: 123456789
  },
  logs: {
    exceeded: [],
    lostSignal: [],
    sensorError: [],
  }
}

export default function createReducer(state = initialState, action) {
  const cloneState = _.clone(state)
  const {type, payload} = action
  switch (type) {
    case TOGGLE_LOADING: {
      cloneState.loading = payload
      return cloneState
    }
    // case TOGGLE_LOADING: return {...state, loading: payload.data}

    case GET_COUNTS: return state

    case PREPEND_DATA_SOURCE: return state

    case UPDATE_DATA_SOURCE: {
      if (payload.type === EXCEEDED) {
        cloneState.logs.exceeded = _.concat(cloneState.logs.exceeded, payload.data)
        // merged = [ ...cloneState.logs.exceeded, ...payload.data]
      }
      else if (payload.type === LOST_SIGNAL) {
        cloneState.logs.lostSignal = _.concat(cloneState.logs.lostSignal, payload.data)
        // merged = [ ...cloneState.logs.lostSignal, ...payload.data]
      }
      else if (payload.type === SENSOR_ERROR) {
        cloneState.logs.sensorError = _.concat(cloneState.logs.sensorError, payload.data)
        // merged = [ ...cloneState.logs.sensorError, ...payload.data]
      }
      return cloneState
    }

    default:
      return state
  }
}
