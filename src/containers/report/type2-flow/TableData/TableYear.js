import { Table } from 'antd'
import React from 'react'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'

function TableYear({ data, loading }) {
  if (_.isEmpty(data)) {
    return null
  }

  const monthsFlat = data.reduce((base, current) => {
    const monthData = current.data.map(dataItem => dataItem._id)
    return [...base, ...monthData]
  }, [])

  const monthsUnique = new Set(monthsFlat)

  const columnsYear = [...monthsUnique].map(month => ({
    title: month,
    dataIndex: 'data',
    align: 'right',
    render: value => {
      const dataGroupYear = _.keyBy(value, '_id')
      const dataGroupMonth = _.get(dataGroupYear[month], 'value')
      return <div>{!dataGroupMonth ? '-' : dataGroupMonth}</div>
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
      align: 'right',
      width: 120,
      fixed: 'left',
      render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    },
    ...columnsYear,
  ]

  return (
    <Table
      loading={loading}
      bordered
      dataSource={data}
      columns={columns}
      rowKey={row => row.station._id}
      pagination={false}
    />
  )
}

export default TableYear
