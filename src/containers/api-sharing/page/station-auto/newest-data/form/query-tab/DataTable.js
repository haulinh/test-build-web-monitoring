import { Table } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { colorLevels } from 'constants/warningLevels'
import { i18n } from 'containers/api-sharing/constants'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import { get, keyBy } from 'lodash-es'
import moment from 'moment'
import React from 'react'

const DataTable = ({ measuringList, dataSource, loading, stationAutos }) => {
  const measureListData = keyBy(
    getMeasuringListFromStationAutos(stationAutos),
    'key'
  )

  const columnsMeasuringList = measuringList.map(measure => {
    const measureData = measureListData[measure] || {}
    const title = `${measureData.name} ${measureData.unit &&
      `(${measureData.unit})`}  `
    return {
      dataIndex: 'measuringLogs',
      title,
      render: value => {
        const measureValue = get(value, [measure, 'value'], '-')
        const warningLevel = get(value, [measure, 'warningLevel'], '')
        return (
          <div style={{ color: colorLevels[warningLevel] }}>{measureValue}</div>
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
      title: i18n.table.stationName,
      dataIndex: 'name',
      render: value => <div>{value}</div>,
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
