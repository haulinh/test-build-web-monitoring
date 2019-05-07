import moment from 'moment'

export const GET_COUNTS            = 'NOTIFICATION/GET_COUNTS'
export const PREPEND_DATA_SOURCE   = 'NOTIFICATION/PREPEND_DATA_SOURCE'
export const UPDATE_DATA_SOURCE    = 'NOTIFICATION/UPDATE_DATA_SOURCE'



export function loadNotificationsByType(notificationType) {
  return async dispatch => {
    dispatch({
      type: UPDATE_DATA_SOURCE,
      payload: {
        type: 'EXCEEDED',
        data: [{
          station: 'tram nuoc thai abc xyz',
          exceededTime: moment().format(),
          exceededParams: ['co2 12', 'php 1.5mg'],
          exceededPreparingParams: ['golang 6.7']
        }]
      }
    })
  }
}