import { CONFIGS } from '../actions/config'
import update from 'react-addons-update'

const initialState = {
  color: {
    warningLevel: {
      data: [],
      sensor: []
    }
  }
}

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case CONFIGS.GET_WARNING_LEVELS_COLOR: 
      return _saveWarningLevelConfig(state, action.payload)
    case CONFIGS.UPDATE_WARNING_LEVELS_COLOR_DATA: 
      return _updateWarningLevelColorData(state, action.payload)
    case CONFIGS.UPDATE_WARNING_LEVELS_COLOR_SENSOR: 
      return _updateWarningLevelColorSensor(state, action.payload)
    default:
      return state
  }
}


function _saveWarningLevelConfig(state, value) {
  const colorData = value.find(o => o.key === 'color-station')
  const colorSensor = value.find(o => o.key === 'color-sensor')
  return update(state, {
    color: {
      warningLevel: {
        data: { $set: colorData },
        sensor: { $set: colorSensor },
      }
    }
  })
}


function _updateWarningLevelColorData(state, value) {
  return update(state, {
    color: {
      warningLevel: {
        data: { 
          $set: { value }
        }
      }
    }
  })
}


function _updateWarningLevelColorSensor(state, value) {
  return update(state, {
    color: {
      warningLevel: {
        sensor: { 
          value: {$set: value}
        }
      }
    }
  })
}
