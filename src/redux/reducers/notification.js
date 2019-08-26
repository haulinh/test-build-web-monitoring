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
  RESET_ALL_COUNTS,
  UPDATE_READ
} from '../actions/notification'

export const initialState = {
  visible: false,
  loading: true,
  currentPage: 1,
  count: 0,
  logs: []
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
      return handleClearCount(state)
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
    case UPDATE_READ:
      return handleUpdateRead(state, payload)
    default:
      return state
  }
}

function handleResetAllCount(state) {
  return update(state,{
    count:{ $set: 0 }
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
function handleUpdateDataSource(state, payload) {
  return update(state, {
    logs: { $push: payload }
  })
}

/* NOTE  handle action: clearNotificationCountByType */
/* DONE */
function handleClearCount(cloneState) {
  return update(cloneState, {
    count: { $set: 0 }
  })
}

/* DONE */
function handleUpdateCount(cloneState, payload) {
  cloneState.count += payload
  return cloneState
}

/* DONE */
function handleUpdateAllCount(cloneState, payload) {
  return {...cloneState, ...{count: payload}}
}

/* DONE */
function handleNewMessage(state, payload) {
  state.logs = [payload, ...state.logs]
  return state
}

/* TODO */
function handleUpdateRead(state, id) {
  console.log('---handleUpdateRead---')
  let indexOfId = state.logs.findIndex(item => item._id === id)
  state.logs[indexOfId].isRead = true
  return update(state, {
    logs: {$set: state.logs}
  })
}