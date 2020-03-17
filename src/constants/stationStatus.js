import { COLOR } from "themes/color";
import { warningLevels } from "constants/warningLevels";

export const STATUS_OPTIONS = {
  GOOD: { title: "warningLevels.good", color: COLOR.GOOD },
  DATA_LOSS: { title: "warningLevels.lossData", color: COLOR.DATA_LOSS },
  // NOT_USE: { title: "dashboard.notUse", color: COLOR.DATA_LOSS },

  EXCEEDED: { title: "warningLevels.exceed", color: COLOR.EXCEEDED },
  EXCEEDED_PREPARING: {
    title: "warningLevels.exceedPreparing",
    color: COLOR.EXCEEDED_PREPARING
  }
};

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
  HIGHTGEST: "DATA_LOSS",

  NOT_USE: "NOT_USE",
  DATA_LOSS: "DATA_LOSS",
  EXCEEDED: "EXCEEDED",
  EXCEEDED_PREPARING: "EXCEEDED_PREPARING",
  GOOD: "GOOD"
};

export const STATUS_STATION_LEVEL = {
  DATA_LOSS: 1,
  EXCEEDED: 2,
  EXCEEDED_PREPARING: 3,
  GOOD: 4
};

export const getStatusPriority = (status1, status2) => {
  let a = STATUS_STATION_LEVEL[status1]
    ? STATUS_STATION_LEVEL[status1]
    : STATUS_STATION_LEVEL.GOOD;
  let b = STATUS_STATION_LEVEL[status2]
    ? STATUS_STATION_LEVEL[status2]
    : STATUS_STATION_LEVEL.GOOD;

  if (a < b) return status1;
  else return status2 ? status2 : STATUS_STATION.DATA_GOOD;
};

export const getStatusItem = item => {
  if (item.status === STATUS_STATION.HIGHTGEST) return STATUS_STATION.HIGHTGEST;
  if (item.status === STATUS_STATION.NOT_USE) return STATUS_STATION.HIGHTGEST; // MARK  status cũ do back-end trả về, vẫn còn trạng thái NOT_USE
  if (item.lastLog) {
    let warLevel = warningLevels.GOOD;
    let measuringLogs = item.lastLog.measuringLogs;
    for (let key in measuringLogs) {
      warLevel = getStatusPriority(warLevel, measuringLogs[key].warningLevel);
    }
    return warLevel;
  }
  return STATUS_STATION.DATA_GOOD;
};

export default {
  GOOD: "GOOD",
  CONNECTED: "CONNECTED",
  DATA_LOSS: "DATA_LOSS",
  NOT_USE: "NOT_USE",

  EXCEEDED_AVG_DAY: "EXCEEDED_AVG_DAY"
};
