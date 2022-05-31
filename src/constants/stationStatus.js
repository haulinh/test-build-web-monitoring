import { warningLevels } from 'constants/warningLevels'
import { DATA_COLOR } from 'themes/color'
import { get as _get } from 'lodash'

export const STATUS_OPTIONS = {
  GOOD: { label: 'warningLevels.good', color: DATA_COLOR.GOOD },
  DATA_LOSS: { label: 'warningLevels.lossData', color: DATA_COLOR.DATA_LOSS },
  // NOT_USE: { label: "dashboard.notUse", color: DATA_COLOR.DATA_LOSS },

  EXCEEDED: { label: 'warningLevels.exceed', color: DATA_COLOR.EXCEEDED },
  EXCEEDED_PREPARING: {
    label: 'warningLevels.exceedPreparing',
    color: DATA_COLOR.EXCEEDED_PREPARING,
  },
}

// good: 'Good',
// exceedTendency: 'Tend To Exceed',
// exceedPreparing: 'Tend To Exceed',
// exceed: 'Exceeded',
// dataLoss: 'Lost Data'

export const STATUS_STATION = {
  // HIGHTGEST: 'DATA_LOSS',

  // NOT_USE: 'NOT_USE',
  // DATA_LOSS: 'DATA_LOSS',
  // DATA_EXCEEDED: 'DATA_EXCEEDED',
  // DATA_EXCEEDED_PREPARED: 'DATA_EXCEEDED_PREPARED',
  // DATA_CONNECTED: 'GOOD',
  // SENSOR_ERROR: 'SENSOR_ERROR',
  // SENSOR_GOOD: 'SENSOR_GOOD',
  // SENSOR_MAINTENACE: 'SENSOR_MAINTENACE'
  HIGHTGEST: 'DATA_LOSS',

  NOT_USE: 'NOT_USE',
  DATA_LOSS: 'DATA_LOSS',
  EXCEEDED: 'EXCEEDED',
  EXCEEDED_PREPARING: 'EXCEEDED_PREPARING',
  GOOD: 'GOOD',
  DATA_CONNECTED: 'DATA_CONNECTED',
}

export const STATUS_STATION_LEVEL = {
  DATA_LOSS: 1,
  EXCEEDED: 2,
  EXCEEDED_PREPARING: 3,
  GOOD: 4,
}

export const getStatusPriority = (status1, status2) => {
  let a = STATUS_STATION_LEVEL[status1]
    ? STATUS_STATION_LEVEL[status1]
    : STATUS_STATION_LEVEL.GOOD
  let b = STATUS_STATION_LEVEL[status2]
    ? STATUS_STATION_LEVEL[status2]
    : STATUS_STATION_LEVEL.GOOD

  if (a < b) return status1
  else return status2 ? status2 : STATUS_STATION.DATA_GOOD
}

export const getStatusItem = item => {
  if (item.status === STATUS_STATION.HIGHTGEST) return STATUS_STATION.HIGHTGEST
  if (item.status === STATUS_STATION.NOT_USE) return STATUS_STATION.HIGHTGEST // MARK  status cũ do back-end trả về, vẫn còn trạng thái NOT_USE
  if (item.lastLog) {
    let warLevel = warningLevels.GOOD
    let measuringLogs = item.lastLog.measuringLogs
    for (let key in measuringLogs) {
      warLevel = getStatusPriority(warLevel, measuringLogs[key].warningLevel)
    }
    return warLevel
  }
  return STATUS_STATION.DATA_GOOD
}

export const getConfigColor = (
  colorData,
  key,
  { defaultPrimary, defaultSecond }
) => {
  const dtColor = colorData.find(obj => obj.key === key)
  const primaryColor = _get(dtColor, 'backgroundColor') || defaultPrimary
  const secondColor = _get(dtColor, 'color') || defaultSecond
  return {
    primaryColor,
    secondColor,
  }
}

export default {
  GOOD: 'GOOD',
  CONNECTED: 'CONNECTED',
  DATA_LOSS: 'DATA_LOSS',
  NOT_USE: 'NOT_USE',
  DATA_CONNECTED: 'DATA_CONNECTED',
  EXCEEDED_AVG_DAY: 'EXCEEDED_AVG_DAY',
}

export const stationStatusOptions = [
  {
    value: 'GOOD',
    label: 'warningLevels.good',
    color: DATA_COLOR.GOOD,
  },
  {
    value: 'DATA_LOSS',
    label: 'warningLevels.lossData',
    color: DATA_COLOR.DATA_LOSS,
  },
  {
    value: 'EXCEEDED',
    label: 'warningLevels.exceed',
    color: DATA_COLOR.EXCEEDED,
  },
  {
    value: 'EXCEEDED_PREPARING',
    label: 'warningLevels.exceedPreparing',
    color: DATA_COLOR.EXCEEDED_PREPARING,
  },
]

export const STATUS_CAMERA = {
  NOT_EXISTS: 'NOT_EXISTS',
  EXISTS: 'EXISTS',
}
