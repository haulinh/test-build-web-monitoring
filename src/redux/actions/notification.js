import moment from 'moment'
import { TAB_KEYS } from 'constants/notification'
import { getFetch } from 'utils/fetch';
import { branch } from 'recompose';

export const UPDATE_COUNTS         = 'NOTIFICATION/UPDATE_COUNTS'
export const PREPEND_DATA_SOURCE   = 'NOTIFICATION/PREPEND_DATA_SOURCE'
export const UPDATE_DATA_SOURCE    = 'NOTIFICATION/UPDATE_DATA_SOURCE'
export const TOGGLE_LOADING        = 'NOTIFICATION/TOGGLE_LOADING'
export const UPDATE_CURRENT_PAGE   = 'NOTIFICATION/UPDATE_CURRENT_PAGE'

export function loadNotificationsByType(page, type) {
  return async dispatch => {
    toggleLoading(true)
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
                exceededParams: ['co2 12', 'php 1.5mg'],
                exceededPreparingParams: []
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                exceededParams: [],
                exceededPreparingParams: ['golang 6.7']
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                exceededParams: ['FLOW 40,470.00', 'php 3.56 (mg/l)', 'FLOW 40,470.00', 'php 3.56 (mg/l)', 'FLOW 40,470.00', 'php 3.56 (mg/l)', 'FLOW 40,470.00', 'php 3.56 (mg/l)', 'FLOW 40,470.00', 'php 3.56 (mg/l)', 'FLOW 40,470.00', 'php 3.56 (mg/l)', 'FLOW 40,470.00', 'php 3.56 (mg/l)',],
                exceededPreparingParams: ['golang 6.7']
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                exceededParams: ['co2 12', 'php 1.5mg'],
                exceededPreparingParams: ['co2 12', 'php 1.5mg','co2 12', 'php 1.5mg','co2 12', 'php 1.5mg','co2 12', 'php 1.5mg','co2 12', 'php 1.5mg']
              },
              {
                station: `tram nuoc thai ${1}`,
                exceededTime: moment().format(),
                exceededParams: ['FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)',],
                exceededPreparingParams: ['FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)','FLOW 40,470.00', 'php 3.56 (mg/l)',]
              },
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
    toggleLoading(false)
  }
}

export function toggleLoading(flag) {
  return dispatch => {
    dispatch({
      type: TOGGLE_LOADING,
      payload: flag
    })
  }
}

export function clearNotificationCountByType(type) {
  return dispatch => {
    dispatch({
      type: UPDATE_COUNTS,
      payload: type
    })
  }
}


// export function updateCurrentPage(page) {
//   return dispatch => {
//     dispatch({
//       type: UPDATE_CURRENT_PAGE,
//       data: page
//     })
//   }
// }