import update from 'immutability-helper'
import { omit } from 'lodash'
import {
  CREATE_MEASURE,
  GET_MEASURES,
  UPDATE_MEASURE,
  DELETE_MEASURE,
  GET_STATION_AUTOS,
  TOGGLE_SEND_ALARM,
} from '../actions/globalAction'
const initialState = {
  measuresObj: {},
  stationAutosObj: {},
}

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    //#region measures
    case GET_MEASURES: {
      return { ...state, measuresObj: action.payload }
    }

    case UPDATE_MEASURE: {
      const measureUpdate = action.payload
      const measuresObjUpdated = {
        ...state.measuresObj,
        [measureUpdate.key]: {
          ...state.measuresObj[measureUpdate.key],
          ...measureUpdate,
        },
      }
      return { ...state, measuresObj: measuresObjUpdated }
    }

    case CREATE_MEASURE: {
      const newMeasuresObj = {
        ...state.measuresObj,
        [action.payload.key]: action.payload,
      }
      return { ...state, measuresObj: newMeasuresObj }
    }

    case DELETE_MEASURE: {
      const newMeasuresObj = omit(state.measuresObj, action.payload)
      return { ...state, measuresObj: newMeasuresObj }
    }
    //#endregion measures

    //#region stations
    case GET_STATION_AUTOS: {
      return update(state, {
        stationAutosObj: { $set: action.payload },
      })
    }

    case TOGGLE_SEND_ALARM: {
      return update(state, {
        stationAutosObj: {
          [action.payload.stationId]: {
            alarmConfig: {
              $set: action.payload.param,
            },
          },
        },
      })
    }
    //#endregion stations

    default:
      return state
  }
}

export default globalReducer
