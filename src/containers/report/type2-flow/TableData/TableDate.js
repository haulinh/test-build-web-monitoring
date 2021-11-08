import { Empty, Table } from 'antd'
import React from 'react'
import _ from 'lodash'
import { translate as t } from 'hoc/create-lang'

function TableDate({ data }) {
  if (_.isEmpty(data)) {
    return (
      <Empty
        style={{ margin: '0 auto', padding: '8px 16px' }}
        description={t('apiSharingNew.button.nodata')}
      />
    )
  }

  const dataFlat = data.reduce((base, current) => {
    if (_.isEmpty(current.data)) return base

    const dataStation = current.data.map(dataStationItem => ({
      ...dataStationItem,
      station: current.station,
    }))
    return [...base, ...dataStation]
  }, [])

  const dataGroup = dataFlat.reduce((base, current) => {
    if (base.has(current._id)) {
      base.get(current._id).push(current)
      return base
    }

    base.set(current._id, [current])
    return base
  }, new Map())

  const dataSource = [...dataGroup].reduce(
    (base, [currentDate, currentData]) => {
      const dataDate = currentData.map((currentDataItem, index) => ({
        ...currentDataItem,
        ...(index === 0 && {
          date: currentDate,
          spanMerge: currentData.length,
          indexMerge: true,
        }),
      }))

      return [...base, ...dataDate]
    },
    []
  )

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'date',
      render: (value, record) => {
        const obj = {
          children: value,
          props: {},
        }

        if (record.indexMerge) {
          obj.props.rowSpan = record.spanMerge
        } else {
          obj.props.rowSpan = 0
        }
        return obj
      },
    },
    {
      title: 'Trạm quan trắc',
      dataIndex: 'station.name',
    },
  ]

  return (
    <Table
      bordered
      dataSource={dataSource}
      columns={columns}
      rowKey={row => `${row._id}-${row.station.name}`}
    />
  )
}

export default TableDate
