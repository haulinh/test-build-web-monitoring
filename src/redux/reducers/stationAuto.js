import {
  INIT_LOADED,
  GET_STATIONS_AUTO,
  GET_TOTAL_STATIONS_AUTO_ACTIVED,
} from '../actions/stationAuto'

let initstate = {
  isInitLoaded: false,
  list: [],
  totalStationActived: 0,
}

export default function stationAuto(state = initstate, action) {
  let { type, payload } = action
  switch (type) {
    case INIT_LOADED:
      return { ...state, isInitLoaded: true }
    case GET_STATIONS_AUTO: {
      return { ...state, ...{ list: payload } }
    }
    case GET_TOTAL_STATIONS_AUTO_ACTIVED: {
      return { ...state, ...{ totalStationActived: payload } }
    }
    default:
      return state
  }
}
