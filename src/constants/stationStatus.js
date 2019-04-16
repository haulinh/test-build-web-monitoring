export default {
  GOOD: "GOOD",
  CONNECTED: "CONNECTED",
  DATA_LOSS: "DATA_LOSS",
  NOT_USE: "NOT_USE"
};

export const STATUS_OPTIONS = {
  GOOD: { title: "dashboard.connected", color: "#008001" },
  DATA_LOSS: { title: "dashboard.dataLoss", color: "#F03045" },
  NOT_USE: { title: "dashboard.notUse", color: "#4D4E48" }
};

export const STATUS_STATION = {
  HIGHTGEST: "DATA_LOSS",
  
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
  let a = STATUS_STATION_LEVEL[status1]? STATUS_STATION_LEVEL[status1] : STATUS_STATION_LEVEL.GOOD
  let b = STATUS_STATION_LEVEL[status2]? STATUS_STATION_LEVEL[status2] : STATUS_STATION_LEVEL.GOOD

  if (a < b)
    return status1;
  else return status2? status2 : STATUS_STATION.GOOD;
};
