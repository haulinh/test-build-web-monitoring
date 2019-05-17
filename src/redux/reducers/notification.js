import _ from 'lodash';
import update from 'react-addons-update'

import {
  UPDATE_COUNTS,
  UPDATE_ALL_COUNTS,
  CLEAR_COUNTS,
  NEW_MESSAGE,
  UPDATE_DATA_SOURCE,
  TOGGLE_LOADING,
  TOGGLE_VISIBLE_NOTIFICATION_DRAWER,
  RESET_ALL_COUNTS
} from '../actions/notification'

export const initialState = {
  visible: false,
  loading: true, // exceeded loading
  isLoadmoreLostSignal: true,
  isLoadmoreSensorError: true,
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
}

export default function handleNotificationStore(state = initialState, action) {
  const cloneState = _.clone(state)
  const {type, payload} = action
  switch (type) {
    case RESET_ALL_COUNTS: 
      return handleResetAllCount(state)
    case TOGGLE_LOADING: 
      return handleToggleLoading(state, payload)
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
    case TOGGLE_VISIBLE_NOTIFICATION_DRAWER:
      return {...state, ...{visible: payload}}
    default:
      return state
  }
}

function handleResetAllCount(state) {
  return update(state,{
    count:{
      total: {$set: 0},
      exceeded: {$set: 0},
      lostSignal: {$set: 0},
      sensorError: {$set: 0},
    }
  })
}

/* NOTE  handle action: toggleLoading */
/* DONE  */
function handleToggleLoading(state, payload) {
  const {type, value} = payload
  return update(state,{
    [type]: {
      '$set': value
    }
  })
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
  return {...cloneState, ...{count: payload}}
}

/* DONE */
function handleNewMessage(cloneState, payload) {
  const {type, data} = payload
  cloneState.logs[type] = [data, ...cloneState.logs[type]]
  return cloneState
}