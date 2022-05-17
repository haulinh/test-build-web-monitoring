import { translate } from 'hoc/create-lang'
import { dataStatusOptions } from 'constants/dataStatus'
import { translate as t } from 'hoc/create-lang'

export const i18n = () => {
  return {
    searchSelect: t('addon.searchSelect'),
    btnSearchText: t('addon.search'),
    form: {
      province: t(`province.list.title`),
      stationType: t(`avgSearchFrom.form.stationType.label`),
      time: t(`avgSearchFrom.form.time`),
      type: t(`avgSearchFrom.form.type.label`),
      stationAuto: count => t('dataAverage.form.stationAuto', { count }),
      measuringList: count => t('dataAverage.form.measuringList', { count }),
      addCondition: t('dataAverage.form.addCondition'),
    },
    tooltip: {
      addCondition: t('dataAverage.tooltip.addCondition'),
      filterData: t('dataAverage.tooltip.filterData'),
      standard: t('dataAverage.tooltip.standard'),
    },
    standard: {
      label: t('dataAverage.standard.label'),
      placeholder: t('dataAverage.standard.placeholder'),
    },
    tabs: {
      station: {
        label: t('dataAverage.tabs.station.label'),
      },
      overview: {
        label: t('dataAverage.tabs.overview.label'),
        data: t('dataAverage.tabs.overview.data'),
        chart: t('dataAverage.tabs.overview.chart'),
      },
      exportExcel: t('avgSearchFrom.tab.exportExcel'),
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
