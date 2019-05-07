import _ from 'lodash';

import { TAB_KEYS } from 'constants/notification'
import {
  GET_COUNTS,
  PREPEND_DATA_SOURCE,
  UPDATE_DATA_SOURCE
} from '../actions/notification'

const {
  EXCEEDED,
  LOST_DATA,
  DEVICE_ERROR
} = TAB_KEYS


const initialState = {
  logs: {
    exceeded: [],
    lostSignal: [],
    sensorError: [],
  }
}

export default function createReducer(state = initialState, action) {
  const {type, payload} = action
  switch (type) {
    case GET_COUNTS: return state
    case PREPEND_DATA_SOURCE: return state
    case UPDATE_DATA_SOURCE: {
      const result = _.merge(
        ...state, 
        {
          logs: {
            exceeded: payload.data
          }
        }
      )
      console.log(result)
      return result
    }
    default:
      return state
  }
}
