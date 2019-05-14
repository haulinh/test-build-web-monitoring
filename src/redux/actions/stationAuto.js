import StationAutoAPI from 'api/StationAuto'

export const GET_STATIONS_AUTO = 'STATION/GET_STATIONS_AUTO'


/* DONE */
export function getListOfStationAuto(rawState) {
  return async dispatch => {
    let res = await StationAutoAPI.getWarningConfig()
    let {success, data} = res
    if (!success || data.length === 0) return;
    dispatch({
      type: GET_STATIONS_AUTO,
      payload: data
    })
  }
}