import React from 'react'
import { TIME } from '../../constants'
import TabStationObtained from './TableDateObtained'
import TableMonthObtained from './TableMonthObtained'

const TableObtained = ({
  dataSource,
  timeType,
  loading,
  stationKeys,
  stationAutos,
  onChangeTabStation,
}) => {
  const TableDataObtained = {
    [TIME.DATE]: (
      <TabStationObtained
        dataSource={dataSource}
        stationKeys={stationKeys}
        stationAutos={stationAutos}
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
