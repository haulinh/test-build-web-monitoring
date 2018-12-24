import { getConfigApi } from 'config'
import { getFetch } from 'utils/fetch'

function getDataStationFixedUrl(prefix = '') {
  if (prefix) return getConfigApi().dataStationFixed + '/' + prefix
  return getConfigApi().dataStationFixed
}

// data-station-fixed/5c19cf06703cd006643fbe34/template
export default {
  downloadTemplate: ({_id}) => {
    const url = getDataStationFixedUrl(`${_id}/template`)
    return getFetch(url)
  },
  find: ({
    fromDate,
    toDate,
    key,
    measuringList
  }) => {
    var url = getDataStationFixedUrl(`${key}`)
    const params = {}
    if (fromDate) params.from= fromDate
    if (toDate) params.to = toDate
    if (measuringList) params.measuringList= measuringList.join(',')
    return getFetch(url, undefined, { params })
  }
}