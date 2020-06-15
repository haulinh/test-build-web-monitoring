import { translate } from 'hoc/create-lang'

const t = prefix => {
  return translate('dataSearchFilterForm.form.' + prefix)
}

export default function validate(values) {
  const errors = {}
  if (!values.provinceKey) {
    errors.provinceKey = t('province.require')
  }
  if (!values.stationType) {
    errors.stationType = t('stationType.error')
  }
  if (!values.stationAuto) {
    errors.stationAuto = t('stationAuto.error')
  }
  if (!values.type) {
    errors.type = t('type.error')
  }
  if (!values.rangesDate) {
    errors.rangesDate = t('rangesDate.error')
  }
  if (
    !values.measuringList ||
    (Array.isArray(values.measuringList) && !values.measuringList.length)
  ) {
    errors.measuringList = t('measuringList.require')
  }
  if (
    !values.dataStatus ||
    (Array.isArray(values.dataStatus) && !values.dataStatus.length)
  ) {
    errors.dataStatus = t('dataStatus.require')
  }
  if (!values.frequency) {
    errors.frequency = t('frequency.require')
  }
  if (!values.standardKey) {
    errors.standardKey = t('standardKey.require')
  }

  return errors
}
