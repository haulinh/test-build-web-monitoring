import _ from 'lodash';

import { TAB_KEYS } from 'constants/notification'
import {
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
    lostSignal: 4,
    sensorError: 10
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
    case TOGGLE_LOADING: 
      return handleToggleLoading(cloneState, payload)
    case UPDATE_COUNTS: 
      return handleUpdateCounts(cloneState, payload)
    case PREPEND_DATA_SOURCE: 
      return state
    case UPDATE_DATA_SOURCE: 
      return handleUpdateDataSource(cloneState, payload)
    default:
      return state
  }
}

function handleToggleLoading(cloneState, flag) {
  cloneState.loading = flag
  return cloneState
}

function handleUpdateCounts(cloneState, type) {
  let { total, exceeded, lostSignal, sensorError } = cloneState.count
  switch(type) {
    case EXCEEDED: {
      exceeded = 0
      break
    }
    case LOST_SIGNAL: {
      lostSignal = 0
      break
    }
    case SENSOR_ERROR: {
      sensorError = 0
      break
    }
  }
  total = exceeded + lostSignal + sensorError
  console.log('----- total -----: ', total)
  cloneState.count.total = total
  cloneState.count.exceeded = exceeded
  cloneState.count.lostSignal = lostSignal
  cloneState.count.sensorError = sensorError
  return cloneState
}

function handleUpdateDataSource(cloneState, payload) {
  if (payload.type === EXCEEDED) {
    cloneState.logs.exceeded = _.concat(cloneState.logs.exceeded, payload.data)
  }
  else if (payload.type === LOST_SIGNAL) {
    cloneState.logs.lostSignal = _.concat(cloneState.logs.lostSignal, payload.data)
  }
  else if (payload.type === SENSOR_ERROR) {
    cloneState.logs.sensorError = _.concat(cloneState.logs.sensorError, payload.data)
  }
  return cloneState
}
