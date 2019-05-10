import _ from 'lodash';

import { TAB_KEYS } from 'constants/notification'
import {
  UPDATE_COUNTS,
  CLEAR_COUNTS,
  PREPEND_DATA_SOURCE,
  UPDATE_DATA_SOURCE,
  TOGGLE_LOADING,
} from '../actions/notification'

const {
  EXCEEDED,
  LOST_SIGNAL,
  SENSOR_ERROR
} = TAB_KEYS


const initialState = {
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
  }
}

export default function handleNotificationStore(state = initialState, action) {
  const cloneState = _.clone(state)
  const {type, payload} = action
  switch (type) {
    case TOGGLE_LOADING: 
      return handleToggleLoading(cloneState, payload)
    case CLEAR_COUNTS: 
      return handleClearCount(cloneState, payload)
    case UPDATE_COUNTS: 
      return handleUpdateCount(cloneState, payload)
    case PREPEND_DATA_SOURCE: 
      return state
    case UPDATE_DATA_SOURCE:
      return handleUpdateDataSource(cloneState, payload)
    default:
      return state
  }
}

/* NOTE  handle action: toggleLoading */
function handleToggleLoading(cloneState, flag) {
  console.log('---- loading ----', flag)
  cloneState.loading = flag
  return cloneState
}

/* NOTE  handle action: loadNotificationsByType */
/* TODO  MOCKUP, NO REAL */
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

/* NOTE  handle action: clearNotificationCountByType */
/* DONE */
function handleClearCount(cloneState, type) {
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
  total = _.sum([exceeded, lostSignal, sensorError])
  
  return _.assign(
    cloneState,
    { count: {total, exceeded, lostSignal, sensorError} }
  )
}

/* NOTE  handle action: getTotalByNotificationType */
/* DONE */
function handleUpdateCount(cloneState, data) {
  let exceeded = _.find(data, {_id: 'EXCEEDED'})
  let lostSignal = _.find(data, {_id: 'DATA_LOSS'})
  let sensorError = _.find(data, {_id: 'ERROR'})

  let rawExceeded = cloneState.count.exceeded
  let rawLostSignal = cloneState.count.lostSignal
  let rawSensorError = cloneState.count.sensorError

  exceeded = exceeded ? exceeded.count + rawExceeded : rawExceeded
  lostSignal = lostSignal ? lostSignal.count + rawLostSignal : lostSignal
  sensorError = sensorError ? sensorError.count + rawSensorError : rawSensorError
  const total = _.sum([exceeded, lostSignal, sensorError])

  return _.assign(
    cloneState, 
    { count: {total, exceeded, lostSignal, sensorError} }
  )
}
