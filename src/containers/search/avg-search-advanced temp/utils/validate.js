import { translate } from 'hoc/create-lang'

export default function validate(values) {
  const errors = {}
  if (!values.stationAuto) {
    errors.stationAuto = translate(
      'dataSearchFilterForm.form.stationAuto.error'
    )
  }
  if (!values.type) {
    errors.type = translate('dataSearchFilterForm.form.type.error')
  }
  if (!values.rangesDate) {
    errors.rangesDate = translate('dataSearchFilterForm.form.rangesDate.error')
  }
  if (
    !values.measuringList ||
    (Array.isArray(values.measuringList) && !values.measuringList.length)
  ) {
    errors.measuringList = translate(
      'dataSearchFilterForm.form.measuringList.require'
    )
  }
  if (
    !values.dataStatus ||
    (Array.isArray(values.dataStatus) && !values.dataStatus.length)
  ) {
    errors.dataStatus = translate(
      'dataSearchFilterForm.form.dataStatus.require'
    )
  }
  if (!values.frequency) {
    errors.frequency = translate('dataSearchFilterForm.form.frequency.require')
  }
  if (!values.qcvn) {
    errors.qcvn = translate('dataSearchFilterForm.form.qcvn.require')
  }

  return errors
}
