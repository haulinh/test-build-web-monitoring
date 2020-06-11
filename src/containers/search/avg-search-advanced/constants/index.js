import { translate } from 'hoc/create-lang'
export const listFilter = [
  // {
  //   title: 'Tình trạng thiết bị',
  //   key: 'stationStatus',
  // },
  {
    title: translate('dataSearchFilterForm.form.dataStatus.label'),
    key: 'dataStatus',
  },
  {
    title: translate('dataSearchFilterForm.form.frequency.label'),
    key: 'frequency',
  },
  {
    title: translate('dataSearchFilterForm.form.qcvn.label'),
    key: 'qcvn',
  },
  // {
  //   title: 'Mã trạm',
  //   key: 'stationKey',
  // },
]
