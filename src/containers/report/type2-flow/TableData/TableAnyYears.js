import { Table } from 'antd'
import React from 'react'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'
import { getFormatNumber } from 'constants/format-number'

function TableAnyYears({ data, loading }) {
  if (_.isEmpty(data)) {
    return null
  }

  const dataSortByProvince = data.sort((a, b) =>
    _.get(b.station, 'province.key', '').localeCompare(
      _.get(a.station, 'province.key', '')
    )
  )

  const yearsFlat = data.reduce((base, current) => {
    const yearData = current.data.map(dataItem => dataItem._id)
    return [...base, ...yearData]
  }, [])

  const yearsUnique = new Set(yearsFlat)

  const columnsYear = [...yearsUnique].map(year => ({
    title: `${t('report.type2_flow.option.year')} ${year}`,
    dataIndex: 'data',
    align: 'right',
    render: value => {
      const dataGroupYears = _.keyBy(value, '_id')
      const dataGroupYear = dataGroupYears[year]
      const dataYear = _.get(dataGroupYear, 'value')
      return <div>{getFormatNumber(dataYear, 2)}</div>
    },
  }))

  const columns = [
    {
      title: t('report.type2_flow.stationName'),
      dataIndex: 'station.name',
      width: 500,
    },
    //remove diameter
    // {
    //   title: t('report.type2_flow.diameter'),
    //   dataIndex: 'station.diameter',
    //   align: 'right',
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
      rowKey={row => `${row._id}-${row.station.name}`}
      pagination={false}
    />
  )
}

export default TableAnyYears
