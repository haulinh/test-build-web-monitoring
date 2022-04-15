import { translate } from 'hoc/create-lang'

export const REPORT_TYPE = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
}

export const FIELDS = {
  STATION_KEYS: 'stationKeys',
  STATISTIC: 'statistic',
  TIME_VALUE: 'timeValue',
  TIME_TYPE: 'time',
  REPORT_TYPE: 'reportType',
  STATION_TYPE: 'stationType',
  PROVINCE: 'province',
}

export const STATISTIC_TYPE = {
  MONTH: 'month',
  DATE: 'date',
}

export const TIME = {
  DATE: 'date',
  MONTH: 'month',
  YEAR: 'year',
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
      typeReport: translate('billing.label.reportType'),
      province: translate('report.label.province'),
    },
    select: {
      reportType: {
        obtained: translate('report.type10.select.reportType.obtained'),
        monitoring: translate('report.type10.select.reportType.monitoring'),
      },
    },
    table: {
      title: {
        measure: translate('report.type10.table.title.measure'),
        valuesByDesign: translate('report.type10.table.title.valuesByDesign'),
        valuesReceived: translate('report.type10.table.title.valuesReceived'),
        numberOfError: translate('report.type10.table.title.numberOfError'),
        percentageReceived: translate(
          'report.type10.table.title.percentageReceived'
        ),
        percentageError: translate('report.type10.table.title.percentageError'),
      },
    },
    nameReport: translate('report.type10.nameReport'),
    // select: {
    //   reportType: {
    //     obtained: translate('roleManager.rule.tiLeDuLieuThuDuoc.name'),
    //     monitoring: translate('')
    //   },
    // },
  }
}
