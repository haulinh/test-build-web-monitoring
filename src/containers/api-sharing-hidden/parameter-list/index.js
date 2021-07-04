import React, { Component } from 'react'
import { Table } from 'antd'

const columns = [
  {
    title: 'Field',
    dataIndex: 'field',
    key: 'field',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
]

export default class ParameterList extends Component {
  render() {
    const { parameters } = this.props

    return (
      <Table
        dataSource={parameters}
        columns={columns}
        pagination={false}
        rowKey={item => item.field}
      />
    )
  }
}
