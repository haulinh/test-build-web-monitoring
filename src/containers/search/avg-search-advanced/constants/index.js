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
    title: translate('dataSearchFilterForm.form.frequent.label'),
    key: 'frequent',
  },
  {
    title: translate('dataSearchFilterForm.form.standardKey.label'),
    key: 'standardKey',
  },
  // {
  //   title: 'Mã trạm',
  //   key: 'stationKey',
  // },
]
