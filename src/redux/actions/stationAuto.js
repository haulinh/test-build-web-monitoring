import StationAutoAPI from 'api/StationAuto'

export const INIT_LOADED = 'STATION/INIT_LOADED'
export const GET_STATIONS_AUTO = 'STATION/GET_STATIONS_AUTO'
export const GET_TOTAL_STATIONS_AUTO_ACTIVED =
  'STATION/GET_TOTAL_STATIONS_AUTO_ACTIVED'

/* DONE */
export function getListOfStationAuto(rawState) {
  return async dispatch => {
    let res = await StationAutoAPI.getWarningConfig()
    let { success, data } = res
    if (!success) return

    dispatch({
      type: GET_STATIONS_AUTO,
      payload: data
    })
    dispatch({ type: INIT_LOADED })
  }
}

export function getTotalActived() {
  return async dispatch => {
    let res = await StationAutoAPI.getTotalCount()
    let { success, data } = res
    if (!success) return

    dispatch({
      type: GET_TOTAL_STATIONS_AUTO_ACTIVED,
      payload: data
    })
  }
}
