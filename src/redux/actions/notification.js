import moment from 'moment-timezone'
import _ from 'lodash'
import slug from 'constants/slug'
import FcmAPI from 'api/NotificationApi'

export const RESET_ALL_COUNTS = 'NOTIFICATION / RESET_ALL_COUNTS'
export const UPDATE_COUNT_ON_NEW_MSG = 'NOTIFICATION / UPDATE_COUNT_ON_NEW_MSG'
export const UPDATE_ALL_COUNTS = 'NOTIFICATION / UPDATE_ALL_COUNTS'
export const CLEAR_COUNTS = 'NOTIFICATION / CLEAR_COUNTS'
export const NEW_MESSAGE = 'NOTIFICATION / NEW_MESSAGE'

export const NOTIFICATION_CLEAR_DATA_SOURCE = 'NOTIFICATION / CLEAR_DATA_SOURCE'
export const UPDATE_DATA_SOURCE = 'NOTIFICATION / UPDATE_DATA_SOURCE'
export const UPDATE_DATA_SOURCE_ON_MESSAGE =
  'NOTIFICATION / UPDATE_DATA_SOURCE_ON_MESSAGE'
export const TOGGLE_LOADING = 'NOTIFICATION / TOGGLE_LOADING'
export const UPDATE_CURRENT_PAGE = 'NOTIFICATION / UPDATE_CURRENT_PAGE'
export const TOGGLE_VISIBLE_NOTIFICATION_DRAWER =
  'NOTIFICATION / TOGGLE_VISIBLE_NOTIFICATION_DRAWER'
export const UPDATE_READ = 'NOTIFICATION / UPDATE_READ'

export function resetAllCounts() {
  return dispatch => {
    dispatch({
      type: RESET_ALL_COUNTS,
    })
  }
}

function updateAllCounts(numberCountsIsNotSeen) {
  return {
    type: UPDATE_ALL_COUNTS,
    payload: numberCountsIsNotSeen,
  }
}

/* NOTE  emit to reducer: handleToggleLoading */
export function setDrawerVisible(flag) {
  return dispatch => {
    dispatch({
      type: TOGGLE_VISIBLE_NOTIFICATION_DRAWER,
      payload: flag,
    })
  }
}

/* NOTE  emit to reducer: handleToggleLoading */
function setLoadingStatus(flag) {
  return {
    type: TOGGLE_LOADING,
    payload: flag,
  }
}

function updateCurrentPage() {
  return {
    type: UPDATE_CURRENT_PAGE,
  }
}

function updateDataSource(payload) {
  return {
    type: UPDATE_DATA_SOURCE,
    payload,
  }
}

function updateCountOnNewMsg(num = 1) {
  return {
    type: UPDATE_COUNT_ON_NEW_MSG,
    payload: num,
  }
}

function updateDataSourceOnNewMsg(data) {
  return {
    type: NEW_MESSAGE,
    payload: data,
  }
}

/** @description
 * - load notification logs and update to redux
 */
const ITEM_PER_PAGE = 20
export function loadNotificationsByType(page, stations, search = undefined) {
  return async dispatch => {
    try {
      let res = await FcmAPI.loadNotificationsByType({
        page,
        itemPerPage: ITEM_PER_PAGE,
        search,
      })
      const { success, data } = res

      if (!success) {
        return
      }

      if (data.length < ITEM_PER_PAGE) {
        dispatch(setLoadingStatus(false))
      }

      /* nếu vẫn còn data thì show loading và load tiếp */
      if (data.length >= ITEM_PER_PAGE) {
        dispatch(updateCurrentPage())
      }

      const transformedData = _.compact(
        _.map(data, item => {
          let stationInfo = _.find(stations, { _id: item.station_id })
          /* NOTE  lý do không có stationInfo: có thể đã bị xóa khỏi tổ chức */
          /* PROBLEM  cần họp mọi người giải quyết vấn đề này, @thao nắm vấn đề */
          if (!stationInfo) return
          return _generateNotificationCellByType(item, stationInfo)
        })
      )

      dispatch(updateDataSource(transformedData))
    } catch (err) {
      console.log(err.message)
    }
  }
}
export function clearLoadNotificationsByType() {
  return async dispatch => {
    dispatch(setLoadingStatus(true))
    dispatch(updateCurrentPage())
    dispatch({
      type: NOTIFICATION_CLEAR_DATA_SOURCE,
      payload: [],
    })
  }
}

/* @task */
/* NOTE  emit to reducer: handleUpdateDataSource */
export function updateNotificationOnMessage(data, stations) {
  return async dispatch => {
    let stationInfo = _.find(stations, { _id: data.station_id })
    let item = _generateNotificationCellByType(data, stationInfo)

    dispatch(updateCountOnNewMsg())
    dispatch(updateDataSourceOnNewMsg(item))
  }
}

/* clear all count khi click vào cái chuông */
export function clearNotificationCountByType(type) {
  return async dispatch => {
    let res = await FcmAPI.updateIsSeenByType(type)

    if (res.success) {
      dispatch({
        type: CLEAR_COUNTS,
      })
    }
  }
}

export function clearTotalNotificationCount() {
  return async dispatch => {
    let res = await FcmAPI.updateIsSeenAll()

    if (res.success) {
      dispatch(resetAllCounts())
    }
  }
}

export function getTotalByNotificationType() {
  return async dispatch => {
    dispatch(resetAllCounts())

    let res = await FcmAPI.getTotalByNotificationType()
    const { success, data } = res

    if (data.totalIsNotSeen === 0 || !success) return

    dispatch(updateAllCounts(data.totalIsNotSeen))
  }
}

export function updateNotifyRead(data) {
  return async dispatch => {
    /* TODO  update database */
    let { _id } = data
    let res = await FcmAPI.updateIsRead(_id)

    if (res.success) {
      dispatch({
        type: UPDATE_READ,
        payload: _id,
      })
    }
  }
}

function _generateNotificationCellByType(rawContent, stationInfo) {
  // generate ra link filter station monitoring
  const formSearchViewDetail = {
    stationAuto: stationInfo.key,
  }
  let viewDetailURL =
    slug.monitoring.base +
    '?formData=' +
    encodeURIComponent(JSON.stringify(formSearchViewDetail))

  // generate ra link xem giá trị quanh thời điểm vượt ngưỡng
  const fromDate = moment(rawContent.createdAt)
    .subtract(2, 'hours')
    .format()
  const toDate = moment(rawContent.createdAt)
    .add(2, 'hours')
    .format()
  const formSearchRawData = {
    stationType: stationInfo.stationType.key,
    stationAuto: stationInfo.key,
    measuringData: stationInfo.measuringList,
    measuringList: rawContent.dataFilter,
    rangesDate: 'ranges',
    fromDate,
    toDate,
    searchRange: true,
    searchNow: true,
  }
  const RawDataURL =
    slug.dataSearch.base +
    '?formData=' +
    encodeURIComponent(JSON.stringify(formSearchRawData))

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
      aroundAtExceededTime: RawDataURL,
    },
  }

  return cellContent
}
