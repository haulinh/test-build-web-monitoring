import React from 'react'
import { Empty, Table } from 'antd'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'
import { getFormatNumber } from 'constants/format-number'

function TableMonth({ data, loading }) {
  if (_.isEmpty(data)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={t('apiSharingNew.button.nodata')}
      />
    )
  }
  const daysData = data.reduce((base, current) => {
    const dayData = current.data.map(dataItem => dataItem._id)
    return [...base, ...dayData]
  }, [])
  const daysUnique = new Set(daysData)

  const columnsMonth = [...daysUnique].map(day => ({
    title: day,
    dataIndex: 'data',
    align: 'right',
    render: value => {
      const dataDay = _.keyBy(value, '_id')
      return (
        <div>{dataDay[day] ? getFormatNumber(dataDay[day].value) : '-'}</div>
      )
    },
  }))

  const columns = [
    {
      title: t('report.type2_flow.stationName'),
      dataIndex: 'station.name',
      width: 200,
      fixed: 'left',
    },
    {
      title: t('report.type2_flow.diameter'),
      dataIndex: 'station.diameter',
      width: 120,
      align: 'right',
      fixed: 'left',

      render: value => {
        if (!value) return '-'
        return value
      },
    },
    ...columnsMonth,
  ]

  return (
    <div>
      <Table
        loading={loading}
        bordered
        dataSource={data}
        columns={columns}
        rowKey={row => `${row._id}-${row.station.key}`}
        pagination={false}
      />
    </div>
  )
}

export default TableMonth
