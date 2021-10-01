import { getConfigApi } from 'config'
import { getFetchDownFile, getFetch, postFetch, pathFetch } from 'utils/fetch'

function calc(prefix = '') {
  return [getConfigApi().calculate, prefix].filter(item => item).join('/')
}

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
  getConfig: () => {
    const url = calc('/ticket-config')
    return getFetch(url)
  },
  createConfig: params => {
    const url = calc('/ticket-config')
    return postFetch(url, params)
  },
  getStatusTicket: () => {
    const url = calc('/ticket-config/status')
    return getFetch(url)
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
  updateCategoryTicket: idTicket => {
    const url = calc(`ticket/${idTicket}/category`)
    return pathFetch(url)
  },
  //#endregion
}
