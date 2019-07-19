import { GET_STATIONS_AUTO_DETAIL } from '../actions/map'

let initstate = {
  stationAuto: null
}

export default function stationAuto(state = initstate, action) {
  let { type, payload } = action
  switch (type) {
    case GET_STATIONS_AUTO_DETAIL: {
      return { ...state, ...{ stationAuto: payload } }
    }
    default:
      return state
  }
}
