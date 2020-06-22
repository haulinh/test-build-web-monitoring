import { translate } from 'hoc/create-lang'
import { dataStatusOptions } from 'constants/dataStatus'
export const listFilter = [
  // {
  //   title: 'Tình trạng thiết bị',
  //   key: 'stationStatus',
  // },
  {
    title: translate('dataSearchFilterForm.form.dataStatus.label'),
    key: 'dataStatus',
    default: dataStatusOptions.map(data => data.value),
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
