import _ from 'lodash';

import { TAB_KEYS } from 'constants/notification'
import {
  UPDATE_COUNTS,
  UPDATE_ALL_COUNTS,
  CLEAR_COUNTS,
  NEW_MESSAGE,
  UPDATE_DATA_SOURCE,
  TOGGLE_LOADING,

  EXCEEDED_LOADING,
  EXCEEDED_LOADED
} from '../actions/notification'

// const {
//   EXCEEDED,
//   LOST_SIGNAL,
//   SENSOR_ERROR
// } = TAB_KEYS


export const initialState = {
  loading: true,
  defaultStartPage: 1,
  currentPage: 0,
  count: {
    total: 0,
    exceeded: 0,
    lostSignal: 0,
    sensorError: 0
  },
  logs: {
    exceeded: [],
    lostSignal: [],
    sensorError: [],
  },
  isLoadingExceeded: false
}

export default function handleNotificationStore(state = initialState, action) {
  const cloneState = _.clone(state)
  const {type, payload} = action
  switch (type) {
    case EXCEEDED_LOADING: return {...state, isLoadingExceeded: true }
    case EXCEEDED_LOADED: return {...state, isLoadingExceeded: false }

    case TOGGLE_LOADING: 
      return handleToggleLoading(cloneState, payload)
    case CLEAR_COUNTS: 
      return handleClearCount(cloneState, payload)
    case UPDATE_COUNTS: 
      return handleUpdateCount(cloneState, payload)
    case UPDATE_ALL_COUNTS: 
      return handleUpdateAllCount(cloneState, payload)
    case NEW_MESSAGE: 
      return handleNewMessage(cloneState, payload)
    case UPDATE_DATA_SOURCE:
      return handleUpdateDataSource(cloneState, payload)
    default:
      return state
  }
}

/* NOTE  handle action: toggleLoading */
/* DONE  */
function handleToggleLoading(cloneState, flag) {
  console.log('---- loading ----', flag)
  cloneState.loading = flag
  return cloneState
}

/* NOTE  handle action: loadNotificationsByType */
/* DONE  */
function handleUpdateDataSource(cloneState, payload) {
  const {type, data} = payload
  cloneState.logs[type] = [...cloneState.logs[type], ...data]
  return cloneState
}

/* NOTE  handle action: clearNotificationCountByType */
/* DONE */
function handleClearCount(cloneState, type) {
  cloneState.count[type] = 0

  let { exceeded, lostSignal, sensorError } = cloneState.count
  cloneState.count.total = _.sum([exceeded, lostSignal, sensorError])
  
  return cloneState
}

/* DONE */
function handleUpdateCount(cloneState, payload) {
  let {type, count} = payload
  cloneState.count[type] += count
  cloneState.count.total += count
  return cloneState
}

/* DONE */
function handleUpdateAllCount(cloneState, payload) {
  cloneState.count = payload
  return cloneState
}

/* DONE */
function handleNewMessage(cloneState, payload) {
  const {type, data} = payload
  cloneState.logs[type] = [data, ...cloneState.logs[type]]
  return cloneState
}