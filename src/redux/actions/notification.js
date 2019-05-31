import moment from 'moment'
import _ from 'lodash'
import slug from 'constants/slug'
import { TAB_KEYS } from 'constants/notification'
import NotificationAPI from 'api/NotificationApi'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date';

export const RESET_ALL_COUNTS                   = 'NOTIFICATION/RESET_ALL_COUNTS'
export const UPDATE_COUNTS                      = 'NOTIFICATION/UPDATE_COUNTS'
export const UPDATE_ALL_COUNTS                  = 'NOTIFICATION/UPDATE_ALL_COUNTS'
export const CLEAR_COUNTS                       = 'NOTIFICATION/CLEAR_COUNTS'
export const NEW_MESSAGE                        = 'NOTIFICATION/NEW_MESSAGE'
export const UPDATE_DATA_SOURCE                 = 'NOTIFICATION/UPDATE_DATA_SOURCE'
export const UPDATE_DATA_SOURCE_ON_MESSAGE      = 'NOTIFICATION/UPDATE_DATA_SOURCE_ON_MESSAGE'
export const TOGGLE_LOADING                     = 'NOTIFICATION/TOGGLE_LOADING'
export const UPDATE_CURRENT_PAGE                = 'NOTIFICATION/UPDATE_CURRENT_PAGE'
export const TOGGLE_VISIBLE_NOTIFICATION_DRAWER = 'NOTIFICATION/TOGGLE_VISIBLE_NOTIFICATION_DRAWER'


export function resetAllCounts(){
  return dispatch => {
    dispatch({
      type: RESET_ALL_COUNTS
    })
  }
}

/* NOTE  emit to reducer: handleToggleLoading */
export function setDrawerVisible(flag) {
  return dispatch => {
    dispatch({
      type: TOGGLE_VISIBLE_NOTIFICATION_DRAWER,
      payload: flag
    })
  }
}

/* NOTE  emit to reducer: handleToggleLoading */
export function setIsLoading(type, flag) {
  switch(type) {
    case TAB_KEYS.EXCEEDED: return {
      type: TOGGLE_LOADING,
      payload: {type: 'loading', value: flag}
    }
    case TAB_KEYS.LOST_SIGNAL: return {
      type: TOGGLE_LOADING,
      payload: {type: 'isLoadmoreLostSignal', value: flag}
    }
    case TAB_KEYS.SENSOR_ERROR: return {
      type: TOGGLE_LOADING,
      payload: {type: 'isLoadmoreSensorError', value: flag}
    }
    default:
    break
  }
}

/* NOTE  emit to reducer: handleUpdateDataSource */
const ITEM_PER_PAGE = 8
export function loadNotificationsByType(page, type, stations) {
  return async dispatch => {
    try {
      dispatch(setIsLoading(type, false))
      let res = await NotificationAPI.loadNotificationsByType({ type, page, itemPerPage: ITEM_PER_PAGE })
      const {success, data} = res

      if (!success || data.length === 0) {
        return 
      }

      const transformedData = _.compact(_.map(data, item => {
        let stationInfo = _.find(stations, {_id: item.station_id})
        /* NOTE  lý do không có stationInfo: có thể đã bị xóa khỏi tổ chức */
        /* PROBLEM  cần họp mọi người giải quyết vấn đề này, @thao nắm vấn đề */
        if (!stationInfo) return
        return _generateNotificationCellByType(item, stationInfo)
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
        default:
        break
      }

      if (data.length >= ITEM_PER_PAGE) {
        dispatch(setIsLoading(type, true))
      }
    }
    catch(err) {
      console.log(err.message)
    }
    
  }
}

/* NOTE  emit to reducer: handleUpdateDataSource */
export function updateNotificationOnMessage(message, stations) {
  return async dispatch => {
  
    let stationInfo = _.find(stations, {_id: message.data.station_id})
    console.log('--- message ---', message)
    let item = _generateNotificationCellByType(message, stationInfo)

    switch(message.data.type) { // EXCEEDED || ERROR || DATA_LOST
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
      default:
      break
    }
  }
}

/* NOTE  emit to reducer: handleClearCount */
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
      default:
      break
    }

    if(res.success) {
      dispatch({
        type: CLEAR_COUNTS,
        payload: target
      })
    }
  }
}

export function getTotalByNotificationType(rawState) {
  return async dispatch => {
    dispatch({type: RESET_ALL_COUNTS})
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

function _generateNotificationCellByType(rawContent, stationInfo) {
      // generate ra link filter station monitoring
      const formSearchViewDetail = {
        stationAuto: stationInfo.key,
      }
      let viewDetailURL = slug.monitoring.base + '?formData=' + encodeURIComponent(JSON.stringify(formSearchViewDetail))

      // generate ra link xem giá trị quanh thời điểm vượt ngưỡng
      const fromDate = moment(rawContent.createdAt).subtract(2, 'hours').format()
      const toDate = moment(rawContent.createdAt).add(2, 'hours').format()
      const formSearchRawData = {
        stationType: stationInfo.stationType.key,
        stationAuto: stationInfo.key,
        measuringData: stationInfo.measuringList,
        measuringList: rawContent.dataFilter,
        rangesDate:'ranges',
        fromDate,
        toDate,
        searchRange: true,
        searchNow: true
      }
      const RawDataURL = slug.dataSearch.base + '?formData=' + encodeURIComponent(JSON.stringify(formSearchRawData))
      
      // new content of cell
      const cellContent = {
        station: stationInfo.name,
        exceededTime: moment(rawContent.createdAt).format(DD_MM_YYYY_HH_MM),
        fullBody: {__html: rawContent.full_body},
        actions: {
          viewDetail: '',
          aroundAtExceededTime: ''
        }
      }
      cellContent.actions.viewDetail = viewDetailURL
      cellContent.actions.aroundAtExceededTime = RawDataURL

      return cellContent
}