import { Table } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { DATA_COLOR, i18n } from 'containers/api-sharing/constants'
import { getMeasuringListFromStationAutos } from 'containers/api-sharing/util'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import { get, keyBy } from 'lodash-es'
import moment from 'moment'
import React from 'react'

const DataTable = ({
  measuringList = [],
  dataSource = [],
  loading,
  stationAutos,
  pagination = {},
  setPagination = () => {},
}) => {
  const measureListData = keyBy(
    getMeasuringListFromStationAutos(stationAutos),
    'key'
  )

  let measuringListArray = measuringList
  if (!Array.isArray(measuringList)) measuringListArray = Array(measuringList)

  const columnsMeasuringList = measuringListArray.map(measure => {
    const measureData = measureListData[measure]
    const title = measureData
      ? `${measureData.name} ${measureData.unit && `(${measureData.unit})`}  `
      : '-'
    return {
      dataIndex: 'measuringLogs',
      title,
      render: value => {
        const measureValue = get(value, [measure, 'value'])
        const warningLevel = get(value, [measure, 'warningLevel'], '')
        return (
          <div style={{ color: DATA_COLOR[warningLevel] }}>
            {measureValue ? measureValue.toFixed(2) : '-'}
          </div>
        )
      },
    }
  })

  const columns = [
    {
      title: i18n().table.tt,
      render: (_, __, index) => {
        const { current, pageSize } = pagination
        return <div>{(current - 1) * pageSize + (index + 1)}</div>
      },
    },
    {
      dataIndex: 'receivedAt',
      title: i18n().table.time,
      render: value => {
        const time = moment(value).format(DD_MM_YYYY_HH_MM)
        return <div>{time}</div>
      },
    },
    {
      title: i18n().table.stationName,
      width: 270,
      dataIndex: 'name',
      render: value => <div>{value}</div>,
    },
    ...columnsMeasuringList,
  ]

  const handleOnChange = pagination => {
    setPagination(pagination)
  }

  return (
    <Table
      rowKey={record => `${record.key} ${record.receiveAt}`}
      pagination={pagination}
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      onChange={handleOnChange}
    />
  )
}

export default withApiSharingDetailContext(DataTable)
