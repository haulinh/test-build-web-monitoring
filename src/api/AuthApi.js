import { getConfigApi } from 'config'
import { getFetch, postFetch, putFetch } from '../utils/fetch'

function getAuthUrl(prefix = '') {
  return getConfigApi().auth + '/' + prefix
}

function getUserUrl(prefix = '') {
  return getConfigApi().user + '/' + prefix
}

export function loginUser(data = {}) {
  return postFetch(getAuthUrl('login'), data)
}

export function verifyPhoneNumber(data = {}) {
  return postFetch(getAuthUrl('verify-phone'), data)
}

export function getOTPByPhoneNumber(data = {}) {
  return postFetch(getAuthUrl('send-otp'), data)
}

export function verifyOTPWithPhoneNumber(data = {}) {
  return postFetch(getAuthUrl('validate-otp'), data)
}

export function logoutUser(userId) {
  return postFetch(getAuthUrl('logout'), { userId })
}

export function loginUser2Factor(data = {}) {
  return postFetch(getAuthUrl('security-2fa'), data)
}

export function getMe() {
  return getFetch(getAuthUrl('me'))
}

export function changePassword(_id, data) {
  return postFetch(getUserUrl('organization/change-password/' + _id), data)
}

export function putProfile(
  _id,
  { firstName, lastName, avatar, phone, birthday, preferredLanguage }
) {
  return putFetch(getUserUrl('organization/profile/' + _id),  { firstName, lastName, avatar, phone, birthday, preferredLanguage })
}
export function updateConfigStataion(_id, data) {
  return putFetch(getUserUrl('admin/config-station/' + _id), data)
}

export function putSecurity(data) {
  return putFetch(getUserUrl('organization/security/2fa'), data)
}

export function postSetPassword(data) {
  return postFetch(getAuthUrl('set-password'), data)
}

//Send Code
export function getForgotSendCode(email) {
  return getFetch(getAuthUrl(`forgot-password?email=${email}`))
}

//confirm Code
export function postConfirmCode(data) {
  return postFetch(getAuthUrl('forgot-password'), data)
}

//Reset password
export function putResetPassword(_id, data) {
  return putFetch(getAuthUrl(`forgot-password/${_id}`), data)
}

export function checkPassword({ email, password }) {
  return postFetch(getAuthUrl(`check-password`), { email, password })
}

export default {
  loginUser,
  logoutUser,
  loginUser2Factor,
  getMe,
  changePassword,
  putProfile,
  putSecurity,
  getForgotSendCode,
  postConfirmCode,
  putResetPassword,
  updateConfigStataion,
  postSetPassword,
  checkPassword,
}
