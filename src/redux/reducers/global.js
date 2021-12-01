import _ from 'lodash'
import {
  CREATE_MEASURE,
  GET_MEASURES,
  UPDATE_MEASURE,
  DELETE_MEASURE,
} from '../actions/globalAction'
const initialState = {
  measuresObj: {},
}

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
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
      const newMeasuresObj = _.omit(state.measuresObj, action.payload)
      return { ...state, measuresObj: newMeasuresObj }
    }
    default:
      return state
  }
}

export default globalReducer
