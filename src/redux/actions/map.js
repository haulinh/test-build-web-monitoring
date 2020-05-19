export const GET_STATIONS_AUTO_DETAIL = 'MAP/GET_STATIONS_AUTO_DETAIL'

/* DONE */
export function getStationAuto(station) {
  return async dispatch => {
    dispatch({
      type: GET_STATIONS_AUTO_DETAIL,
      payload: station
    })
  }
}
