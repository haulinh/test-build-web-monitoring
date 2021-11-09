import { Empty, Table } from 'antd'
import React from 'react'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'
import { getFormatNumber } from 'constants/format-number'

function TableYear({ data, loading }) {
  if (_.isEmpty(data)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={t('apiSharingNew.button.nodata')}
      />
    )
  }

  const monthsFlat = data.reduce((base, current) => {
    const monthData = current.data.map(dataItem => dataItem._id)
    return [...base, ...monthData]
  }, [])

  const monthsUnique = new Set(monthsFlat)

  const columnsYear = [...monthsUnique].map(month => ({
    title: month,
    dataIndex: 'data',
    render: value => {
      const dataGroupYear = _.keyBy(value, '_id')
      return (
        <div>
          {dataGroupYear[month]
            ? getFormatNumber(dataGroupYear[month].value)
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
      rowKey={row => row.station._id}
      pagination={false}
    />
  )
}

export default TableYear
