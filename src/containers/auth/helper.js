import moment from 'moment'
import Errors from 'constants/errors'
import { translate } from 'hoc/create-lang'

export const getAuthError = message => {
  switch (message) {
    case Errors.USER_PASSWORD_INCORRECT:
      return translate('login.errors.emailOrPasswordIncorrect')
    case Errors.ACCOUNT_DISABLE:
      return translate('login.errors.accountDisable')
    case Errors.ACCOUNT_NOT_ACTIVATED:
      return translate('login.errors.accountNotActivated')
    case Errors.CODE_NOT_EQUAL:
      return translate('login.errors.codeNotEqual')
    case Errors.ORGANIZATION_NOT_EXIST:
      return translate('login.errors.organizationNotExist')
    case Errors.ACCOUNT_DELETE:
      return translate('login.errors.accountDelete')
    case Errors.PHONE_NOT_EXISTS:
      return translate('login.errors.phoneNotExists')
    case Errors.EMAIL_NOT_EXISTS:
      return translate('login.errors.emailNotExists')
    case Errors.OTP_INCORRECT:
      return translate('login.errors.otpIncorrect')
    case Errors.Forbidden:
      return translate('errors.forbidden')
    default:
      return message
  }
}

export const getRemainTime = timeUTCStr =>
  moment(timeUTCStr).diff(
    moment()
      .utc()
      .format(),
    'seconds'
  )
  
export const formatDuration = (seconds = 0, format = 'MM:ss') => {
  const s = new Date(1000 * seconds).toISOString()
  if (format === 'MM:ss') return s.substr(14, 5)
  if (format === 'HH:MM:ss') return s.substr(11, 8)
  return ''
}
