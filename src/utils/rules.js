import { translate as t } from 'hoc/create-lang'

export const validatePhone = (_, values, callback) => {
  if (!values) {
    callback(t('rules.requiredPhone'))
    return
  }
  
  const { format, phoneNumber} = values
  if (phoneNumber.length !== format.length) {
    callback(t('rules.inValidField', {field: t('global.phoneNumber')}))
    return
  }
  callback()
}

export const validateEmail = (_, email, callback) => {
  if (!email) callback(t('rules.requiredEmail'))
  callback()
}

export const requiredFieldRule = field => (_, value, callback) => {
  if (!value) callback(t('rules.requiredField', { field }))
  callback()
}
