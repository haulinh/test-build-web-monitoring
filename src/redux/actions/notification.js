import moment from 'moment'
import { TAB_KEYS } from 'constants/notification'
import NotificationAPI from 'api/NotificationApi'

export const UPDATE_COUNTS         = 'NOTIFICATION/UPDATE_COUNTS'
export const CLEAR_COUNTS          = 'NOTIFICATION/CLEAR_COUNTS'
export const PREPEND_DATA_SOURCE   = 'NOTIFICATION/PREPEND_DATA_SOURCE'
export const UPDATE_DATA_SOURCE    = 'NOTIFICATION/UPDATE_DATA_SOURCE'
export const TOGGLE_LOADING        = 'NOTIFICATION/TOGGLE_LOADING'
export const UPDATE_CURRENT_PAGE   = 'NOTIFICATION/UPDATE_CURRENT_PAGE'




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
    let res = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${page}`)
    let data = res.json()
    switch(type) {
      case TAB_KEYS.EXCEEDED: {
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.EXCEEDED,
            data: [
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                exceededParams: ['COD 30 (20 mg/L)', 'TSS 12 (10 mg/L)'],
                exceededPreparingParams: []
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                exceededParams: [],
                exceededPreparingParams: ['pH 7 (7.5)']
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                exceededParams: ['COD 30 (20 mg/L)', 'TSS 12 (10 mg/L)', 'COD 30 (20 mg/L)', 'TSS 12 (10 mg/L)', 'COD 30 (20 mg/L)', 'TSS 12 (10 mg/L)', 'COD 30 (20 mg/L)', 'TSS 12 (10 mg/L)'],
                exceededPreparingParams: ['pH 7 (7.5)']
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                exceededParams: ['COD 30 (20 mg/L)'],
                exceededPreparingParams: ['TSS 9.5 (10 mg/L)', 'pH 7 (7.5)', 'COD 19 (20 mg/L)', 'TSS 9.5 (10 mg/L)', 'pH 7 (7.5)', 'COD 19 (20 mg/L)', 'TSS 9.5 (10 mg/L)', 'pH 7 (7.5)', 'COD 19 (20 mg/L)']
              }
            ]
          }
        })
        break;
      }
      case TAB_KEYS.LOST_SIGNAL: {
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.LOST_SIGNAL,
            data: [
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                status: 'receivedSignal',
                content: 'Có tín hiệu trở lại'
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                status: 'lostSignal',
                content: 'Mất tín hiệu'
              }
            ]
          }
        })
        break;
      }
      case TAB_KEYS.SENSOR_ERROR: {
        dispatch({
          type: UPDATE_DATA_SOURCE,
          payload: {
            type: TAB_KEYS.SENSOR_ERROR,
            data: [
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                status: 'deviceGood',
                content: 'Sensor hoạt động trở lại: TSS'
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                status: 'deviceError',
                content: 'Sensor lỗi: TSS'
              }
            ]
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

/* NOTE  emit to reducer: handleUpdateCount */
/* DONE */
export function getTotalByNotificationType() {
  return async dispatch => {
    let res = await NotificationAPI.getTotalByNotificationType()
    const {success, data} = res

    if (data.length === 0 || !success) return;

    if(success) {
      dispatch({
        type: UPDATE_COUNTS,
        payload: data
      })
    }
  }
}
