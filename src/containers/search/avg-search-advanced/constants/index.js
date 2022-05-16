import { translate } from 'hoc/create-lang'
import { dataStatusOptions } from 'constants/dataStatus'

export function listFilter() {
  return [
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
}

export const FIELDS = {
  PROVINCE: 'provinceKey',
  STATION_TYPE: 'stationType',
  RANGE_TIME: 'rangeTime',
  TYPE: 'type',
  STATION_AUTO: 'stationAuto',
  MEASURING_LIST: 'measuringList',
}

export const ACTIVE_TAB = {
  type: 'primary',
  ghost: true,
}

export const DEFAULT_TAB = {
  type: 'default',
  ghost: false,
}
