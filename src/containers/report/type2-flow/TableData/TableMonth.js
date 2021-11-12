import React from 'react'
import { Table } from 'antd'
import { translate as t } from 'hoc/create-lang'
import _ from 'lodash'

function TableMonth({ data, loading }) {
  if (_.isEmpty(data)) {
    return null
  }

  const dataSortByProvince = data.sort((a, b) =>
    _.get(b.station, 'province.key', '').localeCompare(
      _.get(a.station, 'province.key', '')
    )
  )

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
      const data = dataDay[day]
      if (_.isEmpty(data.value)) return '-'
      return data.value
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
        dataSource={dataSortByProvince}
        columns={columns}
        rowKey={row => `${row._id}-${row.station.key}`}
        pagination={false}
      />
    </div>
  )
}

export default TableMonth
