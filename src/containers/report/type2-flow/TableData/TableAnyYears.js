import { Table } from 'antd'
import React from 'react'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'

function TableAnyYears({ data, loading }) {
  if (_.isEmpty(data)) {
    return null
  }

  const yearsFlat = data.reduce((base, current) => {
    const yearData = current.data.map(dataItem => dataItem._id)
    return [...base, ...yearData]
  }, [])

  const yearsUnique = new Set(yearsFlat)

  const columnsYear = [...yearsUnique].map(year => ({
    title: `Năm ${year}`,
    dataIndex: 'data',
    align: 'right',
    render: value => {
      const dataGroupYears = _.keyBy(value, '_id')
      const dataGroupYear = dataGroupYears[year]
      const dataYear = _.get(dataGroupYear, 'value')
      return <div>{!dataYear ? '-' : dataYear}</div>
    },
  }))

  const columns = [
    {
      title: t('report.type2_flow.stationName'),
      dataIndex: 'station.name',
      width: 500,
    },
    {
      title: t('report.type2_flow.diameter'),
      dataIndex: 'station.diameter',
      align: 'right',
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
      rowKey={row => `${row._id}-${row.station.name}`}
      pagination={false}
    />
  )
}

export default TableAnyYears
