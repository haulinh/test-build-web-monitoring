import {
  INIT_LOADED,
  GET_STATIONS_AUTO
} from '../actions/stationAuto'

let initstate = {
  isInitLoaded: false,
  list: []
}

export default function stationAuto(state=initstate, action) {
  let {type, payload} = action  
  switch(type) {
    case INIT_LOADED: return {...state, isInitLoaded: true}
    case GET_STATIONS_AUTO: {
      return {...state, ...{list: payload}}
    }
    default:
      return state
  }
}