import moment from 'moment'
import _ from 'lodash'
import { TAB_KEYS } from 'constants/notification'
import NotificationAPI from 'api/NotificationApi'
import { initialState } from '../reducers/notification'

export const UPDATE_COUNTS         = 'NOTIFICATION/UPDATE_COUNTS'
export const CLEAR_COUNTS          = 'NOTIFICATION/CLEAR_COUNTS'
export const PREPEND_DATA_SOURCE   = 'NOTIFICATION/PREPEND_DATA_SOURCE'
export const UPDATE_DATA_SOURCE    = 'NOTIFICATION/UPDATE_DATA_SOURCE'
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
/* TODO */
export function loadNotificationsByType(page, type) {
  return async dispatch => {
    dispatch(setIsLoading(false))

    let res = await NotificationAPI.loadNotificationsByType({ type, page, itemPerPage:16 })
    if (!res.success) return console.log('Notification action: Error khi load: ', type)
    
    const {data} = res
    const transformedData = _.map(data, item => ({
      station: item.title,
      exceededTime: moment(item.createdAt).format('DD-MM-YYYY hh:mm'),
      fullBody: {__html: item.full_body}
    }))

    switch(type) {
      case TAB_KEYS.EXCEEDED: {
        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            count: {
              ...initialState.count,
              total: initialState.count.total + data.length,
              exceeded: initialState.count.exceeded + data.length
            }
          }
        })
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.EXCEEDED,
            data: initialState.logs.exceeded.concat(transformedData)
          }
        })
        break;
      }
      case TAB_KEYS.LOST_SIGNAL: {
        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            count: {
              ...initialState.count,
              total: initialState.count.total + data.length,
              exceeded: initialState.count.lostSignal + data.length
            }
          }
        })
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.LOST_SIGNAL,
            data: initialState.logs.lostSignal.concat(transformedData)
          }
        })
        break;
      }
      case TAB_KEYS.SENSOR_ERROR: {
        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            count: {
              ...initialState.count,
              total: initialState.count.total + data.length,
              exceeded: initialState.count.sensorError + data.length
            }
          }
        })
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.SENSOR_ERROR,
            data: initialState.logs.sensorError.concat(transformedData)
          }
        })
        break;
      }
    }
    dispatch(setIsLoading(true))
  }
}

/* NOTE  emit to reducer: handleClearCount */
/* DONE */
export function updateNotificationOnMessage(message) {
  return async dispatch => {
    const {count, logs} = initialState
    const {data, notification} = message

    switch(data.type) { // EXCEEDED || ERROR || DATA_LOST
      case TAB_KEYS.EXCEEDED: {
        const item = {
          station: notification.title,
          exceededTime: moment(data.createdAt).format('DD-MM-YYYY hh:mm'),
          fullBody: {__html: data.full_body}
        }

        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            count: {
              ...count,
              total: count.total + 1,
              exceeded: count.exceeded + 1
            }
          }
        })

        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.EXCEEDED,
            data: logs.exceeded.unshift(item)
          }
        })
        break;
        }
      case TAB_KEYS.LOST_SIGNAL: {
        const item = {
          station: notification.title,
          exceededTime: moment(data.createdAt).format('DD-MM-YYYY hh:mm'),
          fullBody: {__html: data.full_body}
        }

        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            count: {
              ...count,
              total: count.total + 1,
              exceeded: count.lostSignal + 1
            }
          }
        })
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.LOST_SIGNAL,
            data: logs.lostSignal.unshift(item)
          }
        })
        break;
      }
      case TAB_KEYS.SENSOR_ERROR: {
        const item = {
          station: notification.title,
          exceededTime: moment(data.createdAt).format('DD-MM-YYYY hh:mm'),
          fullBody: {__html: data.full_body}
        }

        dispatch({
          type: UPDATE_COUNTS,
          payload: {
            count: {
              ...count,
              total: count.total + 1,
              exceeded: count.lostSignal + 1
            }
          }
        })
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.SENSOR_ERROR,
            data: logs.sensorError.unshift(item)
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
    console.log('success', res.success)
    if(res.success) {
      dispatch({
        type: CLEAR_COUNTS,
        payload: type
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

    let {total, exceeded, lostSignal, sensorError} = rawState

    let newExceeded = _.find(data, {_id: 'EXCEEDED'})
    let newLostSignal = _.find(data, {_id: 'DATA_LOSS'})
    let newSensorError = _.find(data, {_id: 'ERROR'})

    newExceeded = newExceeded ? newExceeded.count : 0
    newLostSignal = newLostSignal ? newLostSignal.count : 0
    newSensorError = newSensorError ? newSensorError.count : 0

    total = _.sum([exceeded, lostSignal, sensorError, newExceeded, newLostSignal, newSensorError])

    exceeded += newExceeded
    lostSignal += newLostSignal
    sensorError += newSensorError

    if(success) {
      dispatch({
        type: UPDATE_COUNTS,
        payload: { count: {total, exceeded, lostSignal, sensorError} }
      })
    }
  }
}