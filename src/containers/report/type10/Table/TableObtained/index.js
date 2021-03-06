import React from 'react'
import { TIME } from '../../constants'
import TabStationObtained from './TableDateObtained'
import TableMonthObtained from './TableMonthObtained'

const TableObtained = ({
  dataSource,
  timeType,
  loading,
  tabKeyActive,
  stationKeys,
  stationAutos,
  onChangeTabStation,
}) => {
  const TableDataObtained = {
    [TIME.DATE]: (
      <TabStationObtained
        dataSource={dataSource}
        stationKeys={stationKeys}
        tabKeyActive={tabKeyActive}
        stationAutos={stationAutos}
        loading={loading}
        onChangeTabStation={onChangeTabStation}
      />
    ),

    [TIME.MONTH]: (
      <TableMonthObtained dataSource={dataSource} loading={loading} />
    ),
  }
  return TableDataObtained[timeType]
}

export default TableObtained
