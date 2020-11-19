import { translate } from 'hoc/create-lang'

export const requireRule = {
  required: true,
  message: translate('global.required'),
}

export const emailRule = {
  type: 'email',
  message: translate('global.invalidEmail'),
}
