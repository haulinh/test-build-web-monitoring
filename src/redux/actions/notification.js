import moment from 'moment'
import _ from 'lodash'
import { TAB_KEYS } from 'constants/notification'
import NotificationAPI from 'api/NotificationApi'
import { initialState } from '../reducers/notification'

export const UPDATE_COUNTS         = 'NOTIFICATION/UPDATE_COUNTS'
export const UPDATE_ALL_COUNTS         = 'NOTIFICATION/UPDATE_ALL_COUNTS'
export const CLEAR_COUNTS          = 'NOTIFICATION/CLEAR_COUNTS'
export const NEW_MESSAGE   = 'NOTIFICATION/NEW_MESSAGE'
export const UPDATE_DATA_SOURCE    = 'NOTIFICATION/UPDATE_DATA_SOURCE'
export const UPDATE_DATA_SOURCE_ON_MESSAGE    = 'NOTIFICATION/UPDATE_DATA_SOURCE_ON_MESSAGE'
export const TOGGLE_LOADING        = 'NOTIFICATION/TOGGLE_LOADING'
export const UPDATE_CURRENT_PAGE   = 'NOTIFICATION/UPDATE_CURRENT_PAGE'


export const EXCEEDED_LOADING        = 'NOTIFICATION/EXCEEDED_LOADING'
export const EXCEEDED_LOADED       = 'NOTIFICATION/EXCEEDED_LOADED'




/* NOTE  emit to reducer: handleToggleLoading */
/* DONE */
export function setIsLoading(flag) {
  return {
    type: TOGGLE_LOADING,
    payload: flag
  }
}

/* NOTE  emit to reducer: handleUpdateDataSource */
/* TODO  add actions */
export function loadNotificationsByType(page, type) {
  return async dispatch => {
    dispatch(setIsLoading(false))

    let res = await NotificationAPI.loadNotificationsByType({ type, page, itemPerPage:16 })
    if (!res.success) return console.log('Notification action: Error khi load: ', type)
    
    const {data} = res
    console.log(data)
    const transformedData = _.map(data, item => ({
      station: item.title,
      exceededTime: moment(item.createdAt).format('DD-MM-YYYY hh:mm'),
      fullBody: {__html: item.full_body}
    }))
    
    switch(type) {
      case TAB_KEYS.EXCEEDED: {
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: 'exceeded',
            data: transformedData
          }
        })
        break;
      }
      case TAB_KEYS.LOST_SIGNAL: {
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: 'lostSignal',
            data: transformedData
          }
        })
        break;
      }
      case TAB_KEYS.SENSOR_ERROR: {
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: 'sensorError',
            data: transformedData
          }
        })
        break;
      }
    }
    dispatch(setIsLoading(true))
  }
}

/* NOTE  emit to reducer: handleUpdateDataSource */
/* TODO  add actions */
export function updateNotificationOnMessage(message) {
  return async dispatch => {
    console.log('have a new message: ', message)
    const {data, notification} = message
    console.log('payload on new message', data)
    const item = {
      station: notification.title,
      exceededTime: moment(Number(data.createdAt)).format('DD-MM-YYYY hh:mm'),
      fullBody: {__html: data.full_body},
      actions: {
        viewDetail: ''
      }
    }

    switch(data.type) { // EXCEEDED || ERROR || DATA_LOST
      case TAB_KEYS.EXCEEDED: {
        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            type: 'exceeded',
            count: 1
          }
        })
        dispatch({
          type: NEW_MESSAGE,
          payload: {
            type: 'exceeded',
            data: item
          }
        })
        break;
        }
      case TAB_KEYS.LOST_SIGNAL: {
        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            type: 'lostSignal',
            count: 1
          }
        })
        dispatch({
          type: NEW_MESSAGE,
          payload: {
            type: 'lostSignal',
            data: item
          }
        })
        break;
      }
      case TAB_KEYS.SENSOR_ERROR: {
        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            type: 'sensorError',
            count: 1
          }
        })
        dispatch({
          type: NEW_MESSAGE,
          payload: {
            type: 'sensorError',
            data: item
          }
        })
        break;
      }
    }
  }
}


/* NOTE  emit to reducer: handleClearCount */
/* DONE */
export function clearNotificationCountByType(type) {
  return async dispatch => {
    let res = await NotificationAPI.updateIsSeenByType(type)

    let target = ''
    switch(type) {
      case TAB_KEYS.EXCEEDED: {
        target = 'exceeded'
        break;
      }
      case TAB_KEYS.LOST_SIGNAL: {
        target = 'lostSignal'
        break;
      }
      case TAB_KEYS.SENSOR_ERROR: {
        target = 'sensorError'
        break;
      }
    }

    if(res.success) {
      dispatch({
        type: CLEAR_COUNTS,
        payload: target
      })
    }
  }
}


/* DONE */
export function getTotalByNotificationType(rawState) {
  return async dispatch => {
    let res = await NotificationAPI.getTotalByNotificationType()
    const {success, data} = res

    if (data.length === 0 || !success) return;

    let exceeded = _.find(data, {_id: TAB_KEYS.EXCEEDED})
    let lostSignal = _.find(data, {_id: TAB_KEYS.LOST_SIGNAL})
    let sensorError = _.find(data, {_id: TAB_KEYS.SENSOR_ERROR})

    exceeded = exceeded ? exceeded.count : 0
    lostSignal = lostSignal ? lostSignal.count : 0
    sensorError = sensorError ? sensorError.count : 0

    let total = _.sum([exceeded, lostSignal, sensorError])

    dispatch({
      type: UPDATE_ALL_COUNTS,
      payload: {total, exceeded, lostSignal, sensorError }
    })
  }
}