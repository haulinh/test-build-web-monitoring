import moment from 'moment'
import { getFetch } from 'utils/fetch';

export const GET_COUNTS            = 'NOTIFICATION/GET_COUNTS'
export const PREPEND_DATA_SOURCE   = 'NOTIFICATION/PREPEND_DATA_SOURCE'
export const UPDATE_DATA_SOURCE    = 'NOTIFICATION/UPDATE_DATA_SOURCE'
export const TOGGLE_LOADING        = 'NOTIFICATION/TOGGLE_LOADING'
export const UPDATE_CURRENT_PAGE   = 'NOTIFICATION/UPDATE_CURRENT_PAGE'

export function loadNotificationsByType(page, errorType) {
  return async dispatch => {
    // let url = `http://jsonplaceholder.typicode.com/albums?userId=${page}`
    // let res = await getFetch(url)
    console.log('------------', page)
    // const data = new Array(2).fill(1).map((e, i) => {
    //   return {
    //     station: `tram nuoc thai ${i+1}`,
    //     exceededTime: moment().format(),
    //     exceededParams: ['co2 12', 'php 1.5mg'],
    //     exceededPreparingParams: ['golang 6.7']
    //   }
    // })
    toggleLoading(true)
    dispatch({
      type: UPDATE_DATA_SOURCE,
      payload: {
        type: 'EXCEEDED',
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


// export function updateCurrentPage(page) {
//   return dispatch => {
//     dispatch({
//       type: UPDATE_CURRENT_PAGE,
//       data: page
//     })
//   }
// }