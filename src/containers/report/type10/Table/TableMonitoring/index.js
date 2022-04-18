import React from 'react'
import { TIME } from '../../constants'
import TabStationMonitoring from './TableDateMonitoring'
import TableMonthMonitoring from './TableMonthMonitoring'

const TableMonitoring = ({
  timeType,
  dataSource,
  stationKeys,
  stationAutos,
  tabKeyActive,
  onChangeTabStation,
  measuresObj,
  loading,
}) => {
  const TableDataMonitoring = {
    [TIME.DATE]: (
      <TabStationMonitoring
        onChangeTabStation={onChangeTabStation}
        stationKeys={stationKeys}
        dataSource={dataSource}
        tabKeyActive={tabKeyActive}
        measuresObj={measuresObj}
        loading={loading}
        stationAutos={stationAutos}
      />
    ),
    [TIME.MONTH]: (
      <TableMonthMonitoring
        dataSource={dataSource}
        measuresObj={measuresObj}
        loading={loading}
      />
    ),
  }
  return TableDataMonitoring[timeType]
}

export default TableMonitoring
