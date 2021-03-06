import AuthApi from 'api/AuthApi'
// import CategoryApi from 'api/CategoryApi'
import {
  setAuthToken,
  getAuthToken,
  resetAuthToken,
  setSecretKey,
  resetSecretKey,
} from 'utils/auth'
import moment from 'moment-timezone'
import _, { result as _result } from 'lodash'

// import { CONFIGS } from './config'
import { setLanguage } from 'utils/localStorage'

export const UPDATE_USER_INFO = 'AUTH/update-user-info'
export const FETCH_PENDING_USER = 'AUTH/fetch-pending-user'
export const FETCH_SUCCESS_USER = 'AUTH/fetch-success-user'
export const FETCH_FAIL_USER = 'AUTH/fetch-fail-user'
export const USER_LOGOUT = 'AUTH/user-lgoout'
export const SET_FCM_TOKEN = 'AUTH/SET_FCM_TOKEN'
export const UPDATE_2FA = 'AUTH/UPDATE_2FA'
export const SET_2FA_STATUS = 'AUTH/SET_2FA_STATUS'
export const SET_2FA_TYPE = 'AUTH/SET_2FA_TYPE'

export function fetchUserMe() {
  return async dispatch => {
    if (!getAuthToken()) {
      dispatch({
        type: FETCH_FAIL_USER,
      })
      return { error: true }
    }

    // const warningLevelColor = await CategoryApi.getWarningLevelColor()

    // if (warningLevelColor.error) {
    //   return dispatch({
    //     type: FETCH_FAIL_USER,
    //   })
    // }

    // dispatch({
    //   type: CONFIGS.GET_WARNING_LEVELS_COLOR,
    //   payload: warningLevelColor.data,
    // })
    dispatch({
      type: FETCH_PENDING_USER,
    })

    const auth = await AuthApi.getMe()

    moment.tz.setDefault(
      _result(auth, 'data.organization.timeZone.value'),
      'Asia/Saigon'
    )
    if (auth.error) {
      dispatch({
        type: FETCH_FAIL_USER,
      })
    } else {
      setLanguage(auth.data.preferredLanguage || 'en')
      dispatch({
        type: FETCH_SUCCESS_USER,
        token: getAuthToken(),
        auth: auth.data,
      })
    }
    return auth
  }
}

export function logout(userId) {
  resetAuthToken()
  resetSecretKey()
  try {
    AuthApi.logoutUser(userId)
  } catch (ex) {}
  return {
    type: USER_LOGOUT,
  }
}

export function userLogin(reqData) {
  return async dispatch => {
    const auth = await AuthApi.loginUser(reqData)
    if (auth.success) {
      const secretKey = _.get(auth, ['data', 'organization', 'apiKey'])
      setSecretKey(secretKey)
      setAuthToken(auth.token)
      dispatch({
        type: UPDATE_USER_INFO,
        auth,
      })
    }
    return auth
  }
}

export function userLogin2Factor(reqData) {
  return async dispatch => {
    const auth = await AuthApi.loginUser2Factor(reqData)
    if (auth.success) {
      const secretKey = _.get(auth, ['data', 'organization', 'apiKey'])
      setSecretKey(secretKey)
      setAuthToken(auth.token)
      dispatch({
        type: UPDATE_USER_INFO,
        auth,
      })
    }
    return auth
  }
}

export function setFcmToken(token) {
  return async dispatch => {
    dispatch({
      type: SET_FCM_TOKEN,
      payload: token,
    })
  }
}

export function set2FAStatus(value) {
  return dispatch => {
    dispatch({
      type: SET_2FA_STATUS,
      payload: value,
    })
  }
}

export function set2FAType(value) {
  return dispatch => {
    dispatch({
      type: SET_2FA_TYPE,
      payload: value,
    })
  }
}

export function update2FA(value) {
  return dispatch => {
    dispatch({
      type: UPDATE_2FA,
      payload: value,
    })
  }
}
