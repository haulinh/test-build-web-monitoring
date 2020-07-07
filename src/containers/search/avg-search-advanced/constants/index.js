import { translate } from 'hoc/create-lang'
import { dataStatusOptions } from 'constants/dataStatus'
// import moment from 'moment'

// const dateFormat = 'DD/MM/YYYY'

export const listFilter = [
  // {
  //   title: 'Tình trạng thiết bị',
  //   key: 'stationStatus',
  // },
  {
    title: translate('dataSearchFilterForm.form.dataStatus.label'),
    key: 'dataStatus',
    mode: 'multiple',
    default: dataStatusOptions.map(data => data.value),
  },
  {
    title: translate('dataSearchFilterForm.form.frequent.label'),
    key: 'frequent',
    mode: 'multiple',
  },
  {
    title: translate('dataSearchFilterForm.form.standardKey.label'),
    key: 'standardKey',
    mode: 'multiple',
  },
  // {
  //   title: translate('dataSearchFilterForm.form.activatedAt.label'),
  //   key: 'activatedAt',
  //   default: moment(new Date(), dateFormat),
  // },
  // {
  //   title: translate('dataSearchFilterForm.form.typeSampling.label'),
  //   key: 'typeSampling',
  //   default: 'FTP',
  // },
  // {
  //   title: 'Mã trạm',
  //   key: 'stationKey',
  // },
]
