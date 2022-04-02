import { getConfigApi } from 'config'
import {
  getFetchDownFile,
  getFetch,
  postFetch,
  pathFetch,
  deleteFetch,
} from 'utils/fetch'

function calc(prefix = '') {
  return [getConfigApi().calculate, prefix].filter(item => item).join('/')
}

const prefixAlarm = 'alarm-subscription'
const prefixAlarmLog = 'alarm-log'
const prefixSetupLanguage = 'languages'

export default {
  getWQIPeriodic: params => {
    return getFetch(calc('wqi-periodic'), params)
  },
  exportWQIPeriodic: params => {
    return getFetchDownFile(calc('wqi-periodic/export'), params)
  },
  getStationTypeCalculateByWQI: () => {
    return getFetch(calc('wqi/station-types'))
  },
  getReportBilling: params => {
    const url = calc('billing/query-data')
    return getFetch(url, params)
  },
  exportReportBilling: params => {
    const url = calc('billing/export-data')
    return getFetchDownFile(url, params)
  },

  //#region ticket config
  getConfigs: () => {
    const url = calc('ticket-config')
    return getFetch(url)
  },
  updateConfigById: (id, params) => {
    const url = calc(`ticket-config/${id}`)
    return pathFetch(url, params)
  },
  createConfig: params => {
    const url = calc('ticket-config')
    return postFetch(url, params)
  },
  updateToggel: (id, toggle) => {
    const url = calc(`ticket-config/${id}/${toggle}`)
    return pathFetch(url)
  },
  delConfig: id => {
    const url = calc(`ticket-config/${id}`)
    return deleteFetch(url)
  },
  getStatusTicket: () => {
    const url = calc('ticket-config/status')
    return getFetch(url)
  },
  getStatusTicketInitial: () => {
    const url = calc('ticket-config/init')
    return postFetch(url, {})
  },
  //#endregion

  //#region ticket
  createTicket: params => {
    const url = calc('ticket')
    return postFetch(url, params)
  },
  getTickets: params => {
    const url = calc('ticket')
    return getFetch(url, params)
  },
  getTicket: id => {
    const url = calc(`ticket/${id}`)
    return getFetch(url)
  },
  exportTicket: params => {
    const url = calc('ticket/export')
    return getFetchDownFile(url, params)
  },
  updateTicket: (id, params) => {
    const url = calc(`ticket/${id}`)
    return pathFetch(url, params)
  },
  updateCategoryTicket: (idTicket, params) => {
    const url = calc(`ticket/${idTicket}/category`)
    return pathFetch(url, params)
  },
  deleteTicket: id => {
    const url = calc(`ticket/${id}`)
    return deleteFetch(url)
  },
  //#endregion

  //#region alarm
  createAlarm: param => {
    const url = calc(prefixAlarm)
    return postFetch(url, param)
  },
  createBulkAlarm: param => {
    const url = calc(`${prefixAlarm}/bulk`)
    return postFetch(url, param)
  },
  getAlarms: param => {
    const url = calc(prefixAlarm)
    return getFetch(url, param)
  },
  getAlarmById: id => {
    const url = calc(`${prefixAlarm}/${id}`)
    return getFetch(url)
  },
  updateAlarmById: (id, param) => {
    const url = calc(`${prefixAlarm}/${id}`)
    return pathFetch(url, param)
  },
  getAlarmsLog: param => {
    const url = calc(prefixAlarmLog)
    return getFetch(url, param)
  },
  updateStatusAlarm: (id, status) => {
    const url = calc(`${prefixAlarm}/${id}/${status}`)
    return pathFetch(url)
  },
  //#endregion

  //#region qa-qc
  getQaqcConfigs: param => {
    const url = calc('qaqc-config')
    return getFetch(url, param)
  },
  getQaqcConfig: id => {
    const url = calc(`qaqc-config/${id}`)
    return getFetch(url)
  },
  createQaqcConfig: param => {
    const url = calc(`qaqc-config`)
    return postFetch(url, param)
  },
  deleteQaqcConfig: id => {
    const url = calc(`qaqc-config/${id}`)
    return deleteFetch(url)
  },
  getQaqcConfigById: id => {
    const url = calc(`qaqc-config/${id}`)
    return getFetch(url)
  },
  updateQaqcConfigById: (id, params) => {
    const url = calc(`qaqc-config/${id}`)
    return pathFetch(url, params)
  },
  //#endregion

  //#region filter
  getFilterList: params => {
    const url = calc('search-histories')

    return getFetch(url, params)
  },

  createFilter: params => {
    const url = calc('search-histories')

    return postFetch(url, params)
  },

  deleteFilter: id => {
    const url = calc(`search-histories/${id}`)

    return deleteFetch(url)
  },

  updateFilter: (id, params) => {
    const url = calc(`search-histories/${id}`)

    return pathFetch(url, params)
  },
  //endregion

  //#language setup for content

  getAllLanguageContent: params => {
    const url = calc(`${prefixSetupLanguage}`)
    return getFetch(url, params)
  },
  updateLanguageContent: params => {
    const url = calc(`${prefixSetupLanguage}`)
    return pathFetch(url, params)
  },
}
