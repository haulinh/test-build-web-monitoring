import { translate } from 'hoc/create-lang'
import { dataStatusOptions } from 'constants/dataStatus'
import { translate as t } from 'hoc/create-lang'

export const i18n = () => {
  return {
    searchSelect: t('addon.searchSelect'),
    btnSearchText: t('addon.search'),
    form: {
      province: t(`province.label`),
      stationType: t('stationType.label'),
      time: t(`time`),
      type: t('type.label'),
    },
  }
}

export function listFilter() {
  return [
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
