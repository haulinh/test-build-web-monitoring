import { CONFIGS } from '../actions/config'
import update from 'react-addons-update'

const initialState = {
  color: {
    warningLevel: {}
  }
}

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case CONFIGS.GET_WARNING_LEVELS_COLOR: 
      return _saveWarningLevelConfig(state, action.payload); break
    default:
      return state
  }
}

function _saveWarningLevelConfig(state, value) {
  return update(state, {
    color: {
      warningLevel: {
        $set: [
          {
              "description": "Trạm mất tín hiệu ",
              "backgroundColor": "#8f9bb3",
              "color": "#ffffff",
              "name": "Mất Tín Hiệu",
              "altName": "Mất Tín Hiệu",
          },
          {
              "description": "Trạm vượt tức thời ",
              "backgroundColor": "#1d89ce",
              "color": "#ffffff",
              "name": "Vượt tức thời",
              "altName": "Vượt tức thời",
          },
          {
              "description": "Trạm chuẩn bị vượt  ",
              "backgroundColor": "#884dff",
              "color": "#ffffff",
              "name": "Chuẩn bị vượt",
              "altName": "Chuẩn bị vượt",
          },
          {
              "description": "Trạm trong ngưỡng",
              "backgroundColor": "#2ecc71",
              "color": "#ffffff",
              "name": "Trong ngưỡng",
              "altName": "Trong ngưỡng",
          },
          {
              "description": "Trạm vượt trung bình ngày ",
              "backgroundColor": "#ff1000",
              "color": "#ffffff",
              "name": "Trung bình ngày ",
              "altNname": "Trung bình ngày ",
          }
        ]
      }
    }
  })
}