import { Table } from 'antd'
import React from 'react'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'
import { getFormatNumber } from 'constants/format-number'

function TableYear({ data, loading }) {
  if (_.isEmpty(data)) {
    return null
  }

  const dataSortByProvince = data.sort((a, b) =>
    _.get(b.station, 'province.key', '').localeCompare(
      _.get(a.station, 'province.key', '')
    )
  )

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
      return <div>{getFormatNumber(dataGroupMonth, 2)}</div>
    },
  }))

  const columns = [
    {
      title: t('report.type2_flow.stationName'),
      dataIndex: 'station.name',
      width: 200,
      fixed: 'left',
    },
    //remove diameter
    // {
    //   title: t('report.type2_flow.diameter'),
    //   dataIndex: 'station.diameter',
    //   align: 'right',
    //   width: 120,
    //   fixed: 'left',
    //   render: value => <div>{_.isNumber(value) ? value : '-'}</div>,
    // },
    ...columnsYear,
  ]

  return (
    <Table
      loading={loading}
      bordered
      dataSource={dataSortByProvince}
      columns={columns}
      rowKey={row => row.station._id}
      pagination={false}
    />
  )
}

export default TableYear
