import { translate as t } from 'hoc/create-lang'

export const validatePhone = (_, values, callback) => {
  const { phoneNumber } = values || {}
  if (!phoneNumber)
    callback(t('rules.requiredField', { field: t('global.phoneNumber') }))
  callback()
}

export const validateEmail = (_, email, callback) => {
  if (!email) callback(t('rules.requiredField', { field: t('global.email') }))
  callback()
}

export const requiredFieldRule = field => (_, value, callback) => {
  if (!value) callback(t('rules.requiredField', { field }))
  callback()
}
