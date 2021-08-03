import { getConfigApi } from '../config'
import { deleteFetch, getFetch, postFetch, putFetch } from '../utils/fetch'

export function getStationAutoUrl(prefix = '') {
  return getConfigApi().stationAuto + '/' + prefix
}

export function getStationAutos(
  { page = 1, itemPerPage = 1000 } = {},
  { address, stationType, name } = {}
) {
  var url = getStationAutoUrl(`?page=${page}&itemPerPage=${itemPerPage}`)
  if (address) url += `&address=${address}`
  if (stationType) url += `&stationType=${stationType}`
  if (name) url += `&name=${name}`
  return getFetch(url)
}

export function getStationAutoAll(
  { page = 1, itemPerPage = 1000 } = {},
  { address, stationType, name } = {}
) {
  var url = getStationAutoUrl(`/all?page=${page}&itemPerPage=${itemPerPage}`)
  if (address) url += `&address=${address}`
  if (stationType) url += `&stationType=${stationType}`
  if (name) url += `&name=${name}`
  return getFetch(url)
}

export function getStationAuto(key) {
  return getFetch(getStationAutoUrl(key))
}

// NOTE stationType_id là _id của stationType
export function getTotalCount_by_type(stationType_id) {
  let url = getStationAutoUrl(`count/total-station-by-type`)
  if (stationType_id) url += `?stationType=${stationType_id}`
  return getFetch(url)
}

export function getTotalCount_by_province(province_id) {
  let url = getStationAutoUrl(`count/total-station-by-province`)
  if (province_id) url += `?provinceId=${province_id}`
  return getFetch(url)
}

export function getTotalCount() {
  return getFetch(getStationAutoUrl('subscription/total-count'))
}

export function createStationAuto(measuring = {}) {
  return postFetch(getStationAutoUrl(), measuring)
}

export function updateStationAuto(key, measuring = {}) {
  return putFetch(getStationAutoUrl(key), measuring)
}

export function deleteStationAuto(key) {
  return putFetch(getStationAutoUrl(`delete/${key}`))
}

export function measurePublished(_id, data) {
  return putFetch(getStationAutoUrl(`measure-published/${_id}`), data)
}

export function transferFtp(_id, data) {
  return putFetch(getStationAutoUrl(`transfer-ftp-info/${_id}`), data)
}

export function stationPublished(_id, data) {
  return putFetch(getStationAutoUrl(`station-published/${_id}`), data)
}

export function restoreStationAuto(key) {
  return putFetch(getStationAutoUrl(`restore/${key}`))
}

export function removeStationAuto(key) {
  return deleteFetch(getStationAutoUrl(key))
}

export function getLastLog() {
  return getFetch(getStationAutoUrl('last-log'))
}

/* TODO  xem xet bỏ do không dùng đến nữa
  trước đây:  mỗi lần update 1 trạm nên cần key
  bây giờ:    update 1 lúc nhiều trạm nên dùng `updateStationAutoConfigs` ở dưới
*/
export function updateStationAutoConfig(key, data = {}) {
  return putFetch(getStationAutoUrl(`config-logger/${key}`), data)
}

/* update options of station auto */
export function updateStationAutoOptions(data) {
  return putFetch(getStationAutoUrl('options'), data)
}

export function getCamera() {
  return getFetch(getStationAutoUrl(`camera`))
}

export function getAuthTokenCamera() {
  return getFetch(getStationAutoUrl(`camera/auth`))
}

export function getWarningConfig() {
  return getFetch(getStationAutoUrl('warning/config'))
}

// Truyền file txt lên bộ theo thời gian truyền

export function tranferBonusFTP({ _id, from, to }) {
  return putFetch(getStationAutoUrl(`gen-process-ftp/${_id}`), {
    from,
    to,
  })
}

export function getEvaluateStation(stationId) {
  return getFetch(
    getStationAutoUrl(`evaluate/list_by_id_station?stationId=${stationId}`)
  )
}

export function createEvaluateStation(evaluate = {}) {
  return postFetch(getStationAutoUrl(`evaluate/create`), evaluate)
}

export function deleteEvaluateStation(commentID) {
  return deleteFetch(getStationAutoUrl(`evaluate/${commentID}`))
}

export function editEvaluateStation(evaluate = {}) {
  return putFetch(getStationAutoUrl(`evaluate/update`), evaluate)
}

export function getDashboardInfo(params) {
  return getFetch(getConfigApi().mobile + '/stations-dashboard', params)
}

export default {
  transferFtp,
  getCamera,
  getAuthTokenCamera,
  getStationAutos,
  getStationAutoAll,
  getStationAuto,
  createStationAuto,
  updateStationAuto,
  deleteStationAuto,
  removeStationAuto,
  restoreStationAuto,
  getLastLog,
  updateStationAutoConfig,
  getTotalCount,
  stationPublished,
  measurePublished,
  getWarningConfig,
  updateStationAutoOptions,
  tranferBonusFTP,
  getTotalCount_by_province,
}
