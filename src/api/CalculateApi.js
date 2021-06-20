import { getConfigApi } from 'config'
import { getFetch } from 'utils/fetch'

function calc(prefix = '') {
  return [getConfigApi().calculate, prefix].filter(item => item).join('/')
}

export default {
  getWQIStationFixed: (params) => {
    return getFetch(calc('wqi/station-fixed'), params)
  }
} 
