import _ from 'lodash';

import { TAB_KEYS } from 'constants/notification'
import {
  GET_COUNTS,
  PREPEND_DATA_SOURCE,
  UPDATE_DATA_SOURCE,
  TOGGLE_LOADING,
  UPDATE_CURRENT_PAGE,
} from '../actions/notification'

const {
  EXCEEDED,
  LOST_DATA,
  DEVICE_ERROR
} = TAB_KEYS


const initialState = {
  loading: true,
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
      const merged = [ ...cloneState.logs.exceeded, ...payload.data]
      cloneState.logs.exceeded = merged
      return cloneState
    }

    default:
      return state
  }
}
