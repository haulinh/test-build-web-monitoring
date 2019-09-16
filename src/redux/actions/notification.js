import moment from 'moment-timezone'
import _ from 'lodash'
import slug from 'constants/slug'
import { TAB_KEYS } from 'constants/notification'
import FcmAPI from 'api/NotificationApi'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date';

export const RESET_ALL_COUNTS                   = 'NOTIFICATION / RESET_ALL_COUNTS'
export const UPDATE_COUNT_ON_NEW_MSG            = 'NOTIFICATION / UPDATE_COUNT_ON_NEW_MSG'
export const UPDATE_ALL_COUNTS                  = 'NOTIFICATION / UPDATE_ALL_COUNTS'
export const CLEAR_COUNTS                       = 'NOTIFICATION / CLEAR_COUNTS'
export const NEW_MESSAGE                        = 'NOTIFICATION / NEW_MESSAGE'
export const UPDATE_DATA_SOURCE                 = 'NOTIFICATION / UPDATE_DATA_SOURCE'
export const UPDATE_DATA_SOURCE_ON_MESSAGE      = 'NOTIFICATION / UPDATE_DATA_SOURCE_ON_MESSAGE'
export const TOGGLE_LOADING                     = 'NOTIFICATION / TOGGLE_LOADING'
export const UPDATE_CURRENT_PAGE                = 'NOTIFICATION / UPDATE_CURRENT_PAGE'
export const TOGGLE_VISIBLE_NOTIFICATION_DRAWER = 'NOTIFICATION / TOGGLE_VISIBLE_NOTIFICATION_DRAWER'
export const UPDATE_READ                        = 'NOTIFICATION / UPDATE_READ'


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
export function setIsLoading(flag) {
  return {type: 'loading', value: flag}
}

/* NOTE  emit to reducer: handleUpdateDataSource */
const ITEM_PER_PAGE = 100
export function loadNotificationsByType(page, stations) {
  console.log("page", page)
  return async dispatch => {
    try {
      dispatch(setIsLoading(false))

      let res = await FcmAPI.loadNotificationsByType({ page, itemPerPage: ITEM_PER_PAGE })
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
      console.log(transformedData, "transformedData")
      dispatch({
        type: UPDATE_DATA_SOURCE,
        payload: transformedData
      })

      /* nếu vẫn còn data thì show loading load tiếp */
      if (data.length >= ITEM_PER_PAGE) {
        dispatch(setIsLoading(true))
      }

    }
    catch(err) {
      console.log(err.message)
    }
    
  }
}

/* @task */
/* NOTE  emit to reducer: handleUpdateDataSource */
export function updateNotificationOnMessage(message, stations) {
  return async dispatch => {
  
    let stationInfo = _.find(stations, {_id: message.data.station_id})
    let item = _generateNotificationCellByType(message, stationInfo)

    dispatch({
      type: UPDATE_COUNT_ON_NEW_MSG,
      payload: 1
    })

    dispatch({
      type: NEW_MESSAGE,
      payload: item
    })
  }
}

/* NOTE  emit to reducer: handleClearCount */
export function clearNotificationCountByType(type) {
  return async dispatch => {
    let res = await FcmAPI.updateIsSeenByType(type)

    if(res.success) {
      dispatch({
        type: CLEAR_COUNTS,
      })
    }
  }
}

export function getTotalByNotificationType() {
  return async dispatch => {
    dispatch({type: RESET_ALL_COUNTS})

    let res = await FcmAPI.getTotalByNotificationType()
    const {success, data} = res
    console.log(data, 'noticount')
    // if (data.length === 0 || !success) return;

    // let exceeded = _.find(data, {_id: TAB_KEYS.EXCEEDED})
    // let lostSignal = _.find(data, {_id: TAB_KEYS.LOST_SIGNAL})
    // let sensorError = _.find(data, {_id: TAB_KEYS.SENSOR_ERROR})

    // exceeded = _.get(exceeded, 'count', 0) 
    // lostSignal = _.get(lostSignal, 'count', 0) 
    // sensorError = _.get(sensorError, 'count', 0)  

    // let total = _.sum([exceeded, lostSignal, sensorError])

    dispatch({
      type: UPDATE_ALL_COUNTS,
      payload: 20
    })
  }
}

export function updateNotifyRead(data) {
  return async dispatch => {
    /* TODO  update database */
    let {_id} = data
    let res = await FcmAPI.updateIsRead(_id)
    console.log(res, "resres")
    if(res.success) {
      dispatch({
        type: UPDATE_READ,
        payload: _id
      })
    }
  }
}

function _generateNotificationCellByType(rawContent, stationInfo) {
  console.log('rawContent', rawContent)
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
        _id: rawContent._id,
        stationID: rawContent.station_id,
        title: rawContent.title,
        status: rawContent.status || rawContent.type,
        isRead: rawContent.isRead,
        station: rawContent.title,
        receivedAt: rawContent.receivedAt,
        rawAt: rawContent.rawAt,
        shortBody: rawContent.short_body,
        fullBody: rawContent.full_body,
        measurings: rawContent.measurings,
        dataFilter: rawContent.dataFilter, 
        actions: {
          viewDetail: viewDetailURL,
          aroundAtExceededTime: RawDataURL
        }
      }

      return cellContent
}