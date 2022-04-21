import { translate as t } from 'hoc/create-lang'

export const INCIDENT_INFORMATION = [
  {
    key: 'name',
    name: t('ticket.excel.name'),
    checked: true,
    hidden: false,
  },
  {
    key: 'type',
    name: t('ticket.excel.type'),
    checked: true,
    hidden: false,
  },
  {
    key: 'province',
    name: t('ticket.excel.province'),
    checked: true,
    hidden: false,
  },
  {
    key: 'stations',
    name: t('ticket.excel.stations'),
    checked: true,
    hidden: false,
  },
  {
    key: 'measures',
    name: t('ticket.excel.measures'),
    checked: true,
    hidden: false,
  },
  {
    key: 'status',
    name: t('ticket.excel.status'),
    checked: true,
    hidden: false,
  },
  {
    key: 'createdAt',
    name: t('ticket.excel.createdAt'),
    checked: true,
    hidden: false,
  },
  {
    key: 'timeStart',
    name: t('ticket.excel.timeStart'),
    checked: true,
    hidden: false,
  },
  {
    key: 'timeEnd',
    name: t('ticket.excel.timeEnd'),
    checked: true,
    hidden: false,
  },
]

export const i18n = () => {
  return {
    title: t('ticket.modal.title'),
    description: t('ticket.modal.description'),
    button: {
      cancel: t('ticket.modal.button.cancel'),
      download: t('ticket.modal.button.download'),
    },
  }
}
