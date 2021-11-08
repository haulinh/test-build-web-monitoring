import { Empty, Table } from 'antd'
import React from 'react'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'
import { getFormatNumber } from 'constants/format-number'

function TableAnyYears({ data, loading }) {
  if (_.isEmpty(data)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={t('apiSharingNew.button.nodata')}
      />
    )
  }

  const yearsFlat = data.reduce((base, current) => {
    const yearData = current.data.map(dataItem => dataItem._id)
    return [...base, ...yearData]
  }, [])

  const yearsUnique = new Set(yearsFlat)

  const columnsYear = [...yearsUnique].map(year => ({
    title: `Năm ${year}`,
    dataIndex: 'data',
    render: value => {
      const dataGroupYear = _.keyBy(value, '_id')
      return (
        <div>
          {dataGroupYear[year]
            ? getFormatNumber(dataGroupYear[year].value)
            : '-'}
        </div>
      )
    },
  }))

  const columns = [
    {
      title: 'Trạm quan trắc',
      dataIndex: 'station.name',
    },
    {
      title: 'Đường kính',
      dataIndex: 'station.diameter',
      render: value => <div>{value ? value : '-'}</div>,
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
    />
  )
}

export default TableAnyYears
