import { translate as t } from 'hoc/create-lang'

export const Fields = {
  stationType: 'stationType',
  stationKey: 'stationKey',
  reportType: 'reportType',
  billingConfigId: 'billingConfigId',
  time: 'time',
}

export const maximumFractionDigits = 6

export function i18n() {
  return {
    reportType: {
      label: t('billing.label.reportType'),
    },
    time: {
      label: t('billing.label.time'),
      required: t('billing.required.time'),
      sameQuarter: t('billing.required.sameQuarter'),
    },
    stationType: {
      label: t('billing.label.stationType'),
      required: t('billing.required.stationType'),
    },
    stationName: {
      label: t('billing.label.stationName'),
      required: t('billing.required.stationName'),
    },
    billingConfig: {
      label: t('billing.label.billingConfig'),
      required: t('billing.required.billingConfig'),
    },
  }
}
