import { translate } from 'hoc/create-lang'

export const REPORT_TYPE = {
  OBTAINED: 'obtained',
  MONITORING: 'monitoring',
}

export const FIELDS = {
  STATION_KEYS: 'stationKeys',
  STATISTIC: 'statistic',
  TIME_VALUE: 'timeValue',
  TIME_TYPE: 'timeType',
  REPORT_TYPE: 'reportType',
}

export function i18n() {
  return {
    header1: translate('avgSearchFrom.table.header1'),
    header2: translate('avgSearchFrom.table.header2'),
    header3: translate('avgSearchFrom.table.header3'),
    header4: translate('avgSearchFrom.table.header4'),
    header5: translate('avgSearchFrom.table.header5'),
    header6: translate('avgSearchFrom.table.header6'),
    title: translate('avgSearchFrom.table.title'),
    titleDay: translate('avgSearchFrom.table.titleDay'),

    error: {
      stationType: translate('avgSearchFrom.form.stationType.error'),
      fromMonth: translate('avgSearchFrom.form.fromMonth.error'),
      toMonth: translate('avgSearchFrom.form.toMonth.error'),
      toMonth_1: translate('avgSearchFrom.form.toMonth.error1'),
      toMonth_2: translate('avgSearchFrom.form.toMonth.error2'),
    },
    label: {
      stationType: translate('avgSearchFrom.form.stationType.label'),
      fromMonth: translate('avgSearchFrom.form.fromMonth.label'),
      toMonth: translate('avgSearchFrom.form.toMonth.label'),
      station: translate('apiSharingNew.fields.stationKeys'),
    },
  }
}
