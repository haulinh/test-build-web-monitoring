import _ from 'lodash'
import update from 'react-addons-update'

import {
  UPDATE_COUNT_ON_NEW_MSG,
  UPDATE_ALL_COUNTS,
  CLEAR_COUNTS,
  NEW_MESSAGE,
  NOTIFICATION_CLEAR_DATA_SOURCE,
  UPDATE_DATA_SOURCE,
  TOGGLE_LOADING,
  TOGGLE_VISIBLE_NOTIFICATION_DRAWER,
  UPDATE_CURRENT_PAGE,
  RESET_ALL_COUNTS,
  UPDATE_READ,
  UPDATE_ALL_READ,
  DELETE_ONE,
  DELETE_ALL,
  UPDATE_NOT_READ_ONE,
  UPDATE_READ_ONE,
} from '../actions/notification'

export const initialState = {
  visible: false,
  loading: true,
  currentPage: 1,
  count: 0,
  logs: [],
  isMarkedReadAll: false,
}

export default function handleNotificationStore(state = initialState, action) {
  const cloneState = _.clone(state)
  const { type, payload } = action
  switch (type) {
    case TOGGLE_LOADING:
      return handleToggleLoading(state, payload)
    case RESET_ALL_COUNTS:
      return handleResetAllCount(state)
    case UPDATE_ALL_COUNTS:
      return handleUpdateAllCount(cloneState, payload)
    case CLEAR_COUNTS:
      return handleClearCount(state)
    case UPDATE_COUNT_ON_NEW_MSG:
      return handleUpdateCount(cloneState, payload)
    case NEW_MESSAGE:
      return handleNewMessage(cloneState, payload)
    case UPDATE_DATA_SOURCE:
      return handleUpdateDataSource(cloneState, payload)
    case NOTIFICATION_CLEAR_DATA_SOURCE:
      return handleClearDataSource(state)
    case TOGGLE_VISIBLE_NOTIFICATION_DRAWER:
      return { ...state, ...{ visible: payload } }
    case UPDATE_READ:
      return handleUpdateRead(state, payload)
    case UPDATE_ALL_READ:
      return handleUpdateAllRead(state)
    case DELETE_ONE:
      return handleDeleteOne(state, payload)
    case DELETE_ALL:
      return handleDeleteAll(state)
    case UPDATE_NOT_READ_ONE:
      return handleUpdateNotReadOne(state, payload)
    case UPDATE_READ_ONE:
      return handleUpdateReadOne(state, payload)
    case UPDATE_CURRENT_PAGE:
      return handleUpdateCurrentPage(state)
    default:
      return state
  }
}

function handleResetAllCount(state) {
  return update(state, {
    count: { $set: 0 },
  })
}

/* NOTE  handle action: toggleLoading */
/* DONE  */
function handleToggleLoading(state, payload) {
  return update(state, {
    loading: {
      $set: payload,
    },
  })
}

/* NOTE  handle action: loadNotificationsByType */
/* DONE  */
function handleUpdateDataSource(state, payload) {
  return update(state, {
    logs: { $push: payload },
  })
}
function handleClearDataSource(state) {
  return update(state, {
    logs: { $set: [] },
    currentPage: { $set: 0 },
  })
}

/* NOTE  handle action: clearNotificationCountByType */
/* DONE */
function handleClearCount(cloneState) {
  return update(cloneState, {
    count: { $set: 0 },
  })
}

/* DONE */
function handleUpdateCount(cloneState, payload) {
  cloneState.count += payload
  return cloneState
}

/* DONE */
function handleUpdateAllCount(cloneState, payload) {
  console.log('payloadnoti', payload)
  return update(cloneState, {
    count: { $set: payload },
  })
}

/* DONE */
function handleNewMessage(state, payload) {
  state.logs = [payload, ...state.logs]
  return state
}

/* TODO */
function handleUpdateRead(state, id) {
  let indexOfId = state.logs.findIndex(item => item._id === id)
  state.logs[indexOfId].isRead = true
  return update(state, {
    logs: { $set: state.logs },
  })
}
function handleUpdateAllRead(state) {
  const newLogs = _.map(state.logs, notify => ({ ...notify, isRead: true }))

  return update(state, {
    logs: { $set: newLogs },
  })
}

function handleUpdateCurrentPage(state, payload = 1) {
  let currentPage = state.currentPage + payload
  return update(state, {
    currentPage: { $set: currentPage },
  })
}

function handleDeleteOne(state, notificationId) {
  let newLogs = state.logs
  newLogs = _.filter(newLogs, notify => notify._id !== notificationId)
  return update(state, {
    logs: { $set: newLogs },
  })
}

function handleDeleteAll(state) {
  return update(state, {
    logs: { $set: [] },
  })
}

function handleUpdateNotReadOne(state, notificationId) {
  let newLogs = state.logs
  newLogs = _.map(newLogs, log => {
    if (log._id !== notificationId) {
      return log
    }
    return {
      ...log,
      isRead: false,
    }
  })

  return update(state, {
    logs: { $set: newLogs },
  })
}

function handleUpdateReadOne(state, notificationId) {
  let newLogs = state.logs
  newLogs = _.map(newLogs, log => {
    if (log._id !== notificationId) {
      return log
    }
    return {
      ...log,
      isRead: true,
    }
  })

  return update(state, {
    logs: { $set: newLogs },
  })
}
