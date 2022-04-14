import React from 'react'
import { TIME } from '../../constants'
import TabStationMonitoring from './TableDateMonitoring'
import TableMonthMonitoring from './TableMonthMonitoring'

const DataMonitoring = ({
  timeType,
  dataSource,
  stationKeys,
  stationAutos,
  onChangeTabStation,
  measuresObj,
}) => {
  const TableDataMonitoring = {
    [TIME.DATE]: (
      <TabStationMonitoring
        onChangeTabStation={onChangeTabStation}
        stationKeys={stationKeys}
        dataSource={dataSource}
        measuresObj={measuresObj}
        stationAutos={stationAutos}
      />
    ),
    [TIME.MONTH]: (
      <TableMonthMonitoring dataSource={dataSource} measuresObj={measuresObj} />
    ),
  }
  return TableDataMonitoring[timeType]
}

export default DataMonitoring
