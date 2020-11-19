import moment from 'moment'
import Errors from 'constants/errors'
import { translate } from 'hoc/create-lang'

export const getAuthError = message => {
  switch (message) {
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
    default:
      return message
  }
}

export const getRemainTime = timeISOStr =>
  moment(timeISOStr).diff(
    moment()
      .utc()
      .format(),
    'seconds'
  )
