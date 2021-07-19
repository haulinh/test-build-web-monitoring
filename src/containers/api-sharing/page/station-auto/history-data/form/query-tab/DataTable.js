import { Table } from 'antd'
import { get, keyBy } from 'lodash-es'
import React from 'react'
import moment from 'moment'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { colorLevels } from 'constants/warningLevels'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { i18n } from 'containers/api-sharing/constants'

const DataTable = ({ measuringList, dataSource, loading, stationAutos }) => {
  const measureListData = keyBy(
    getMeasuringListFromStationAutos(stationAutos),
    'key'
  )

  let measuringListArray = measuringList
  if (!Array.isArray(measuringList)) measuringListArray = Array(measuringList)

  const columnsMeasuringList = measuringListArray.map(measure => {
    const measureData = measureListData[measure] || {}
    const title = `${measureData.name} ${measureData.unit &&
      `(${measureData.unit})`}  `
    return {
      dataIndex: 'measuringLogs',
      title,
      render: value => {
        const measureValue = get(value, [measure, 'value'])
        const warningLevel = get(value, [measure, 'warningLevel'], '')
        return (
          <div style={{ color: colorLevels[warningLevel] }}>
            {measureValue ? measureValue.toFixed(2) : '-'}
          </div>
        )
      },
    }
  })

  const columns = [
    {
      title: i18n.table.tt,
      render: (_, __, index) => <div>{index + 1}</div>,
    },
    {
      dataIndex: 'receivedAt',
      title: i18n.table.time,
      render: value => {
        const time = moment(value).format(DD_MM_YYYY_HH_MM)
        return <div>{time}</div>
      },
    },
    ...columnsMeasuringList,
  ]

  return <Table columns={columns} dataSource={dataSource} loading={loading} />
}

export default withApiSharingDetailContext(DataTable)
