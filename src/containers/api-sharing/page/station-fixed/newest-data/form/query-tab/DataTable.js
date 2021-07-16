import { Table } from 'antd'
import { DD_MM_YYYY_HH_MM } from 'constants/format-date'
import { colorLevels } from 'constants/warningLevels'
import { i18n } from 'containers/api-sharing/constants'
import { withApiSharingDetailContext } from 'containers/api-sharing/withShareApiContext'
import { get, keyBy } from 'lodash-es'
import moment from 'moment'
import React from 'react'

const DataTable = ({
  measuringList = [],
  dataSource,
  loading,
  measureListData,
}) => {
  const measureListDataKey = keyBy(measureListData, 'key')

  let measuringListArray = measuringList
  if (!Array.isArray(measuringList)) measuringListArray = Array(measuringList)

  const columnsMeasuringList = measuringListArray.map(measure => {
    const measureData = measureListDataKey[measure] || {}
    const title = `${measureData.name} ${measureData.unit &&
      `(${measureData.unit})`}  `
    return {
      dataIndex: 'measuringLogs',
      title,
      render: value => {
        const measureTextValue = get(value, [measure, 'textValue'])
        if (measureTextValue === 'KPH') return <div>KPH</div>

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
      title: i18n.table.pointName,
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

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      pagination={false}
      scroll={{ x: 'max-content', y: 300 }}
    />
  )
}

export default withApiSharingDetailContext(DataTable)
