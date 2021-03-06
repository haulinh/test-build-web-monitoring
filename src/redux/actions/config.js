import { message } from 'antd'

import CategoryAPI from '../../api/CategoryApi'
import { translate } from 'hoc/create-lang'
import { get as _get } from 'lodash'

function i18n() {
  return {
    submitError: translate('addon.onSave.update.error'),
    submitSuccess: translate('addon.onSave.update.success'),
  }
}

export const CONFIGS = {
  GET_WARNING_LEVELS_COLOR: 'CATEGORY / GET_WARNING_LEVELS_COLOR',
  UPDATE_WARNING_LEVELS_COLOR_DATA:
    'CATEGORY / UPDATE_WARNING_LEVELS_COLOR_DATA',
  UPDATE_WARNING_LEVELS_COLOR_SENSOR:
    'CATEGORY / UPDATE_WARNING_LEVELS_COLOR_SENSOR',
}

export function getWarningLevelColors() {
  return async dispatch => {
    const res = await CategoryAPI.getWarningLevelColor()

    if (res.success) {
      dispatch({
        type: CONFIGS.GET_WARNING_LEVELS_COLOR,
        payload: _get(res, 'data', []),
      })
    }
    return res
  }
}

export function updateWarningLevelColorData(id, data, params = {}) {
  return async dispatch => {
    try {
      let res = {}
      if (params.isRestore) {
        res = await CategoryAPI.restoreWarningLevelColorData(id, data)
      } else {
        res = await CategoryAPI.updateWarningLevelColorData(id, data)
      }
      if (res.success) {
        dispatch({
          type: CONFIGS.UPDATE_WARNING_LEVELS_COLOR_DATA,
          payload: res.data,
        })
      }
      message.success(i18n().submitSuccess)
    } catch (e) {
      message.error(i18n().submitError)
    }
  }
}

export function updateWarningLevelColorSensor(id, data) {
  return async dispatch => {
    try {
      const res = await CategoryAPI.updateWarningLevelColorSensor(id, data)
      if (res.success) {
        dispatch({
          type: CONFIGS.UPDATE_WARNING_LEVELS_COLOR_SENSOR,
          payload: res.data,
        })
        message.success(i18n().submitSuccess)
      }
    } catch (e) {
      console.error('--updateWarningLevelColorSensor--', e)
      message.error(i18n().submitError)
    }
  }
}
