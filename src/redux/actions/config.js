import CategoryAPI from '../../api/CategoryApi'

export const CONFIGS = {
  GET_WARNING_LEVELS_COLOR : 'CATEGORY / GET_WARNING_LEVELS_COLOR'
}

export function getWarningLevelColors(reqData) {
    return async dispatch => {
      const res = await CategoryAPI.getWarningLevelColor()
      if (res.success) {
        dispatch({
          type: CONFIGS.GET_WARNING_LEVELS_COLOR,
          payload: res.value
        })
      }
      return res
    }
}