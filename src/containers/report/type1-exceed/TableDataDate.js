import { Table } from 'antd'
import React from 'react'

const TableDataDate = ({ data, loading }) => {
  const columnsExceed = [1, 2, 3].map(column => ({
    title: `Vượt ngưỡng lần ${column}`,
    children: [
      {
        title: 'Thời điểm phát sinh',
        dataIndex: `data.${column - 1}`,
      },
      {
        title: 'Thời gian xử lý',
      },
      {
        title: 'Giá trị vượt ngưỡng',
      },
    ],
  }))

  const columns = [
    { title: 'Trạm quan trắc' },
    { title: 'Thông số', dataIndex: 'measure' },
    {
      title: 'Đơn vị',
      dataIndex: 'config.unit',
      render: value => <div>{value || '-'}</div>,
    },
    {
      title: 'Giá trị giới hạn',
      dataIndex: 'config',
      render: value => {
        if (!value.maxLimit) return
        if (value.maxLimit && !value.minLimit)
          return <div>{value.maxLimit}</div>

        return <div>{`${value.minLimit}-${value.maxLimit}`}</div>
      },
    },
    {
      title: 'Số liệu trong ngày',
      children: [
        {
          title: 'Giá trị TB',
          dataIndex: 'avg',
          render: value => <div>{value || '-'}</div>,
        },
        {
          title: 'Giá trị lớn nhất',
          dataIndex: 'max',
          render: value => <div>{value || '-'}</div>,
        },
      ],
    },
    ...columnsExceed,
  ]

  const dataSource = data.reduce((base, current) => {
    return [...base, ...current.data]
  }, [])

  return (
    <Table
      dataSource={dataSource}
      loading={loading}
      bordered
      columns={columns}
      size="small"
      pagination={false}
    />
  )
}

export default TableDataDate
