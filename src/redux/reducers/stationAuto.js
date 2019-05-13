import {
  GET_STATIONS_AUTO
} from '../actions/stationAuto'

let initstate = {
  list: []
}

export default function stationAuto(state=initstate, action) {
  let {type, payload} = action  
  switch(type) {
    case GET_STATIONS_AUTO: {
      return {...state, ...{list: payload}}
    }
    default:
      return state
  }
}