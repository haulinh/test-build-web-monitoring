import React, { Component } from 'react'
import { Table, Button, Icon, Popconfirm, Checkbox } from 'antd'
import { FIELDS } from '../index'
import SelectTime from './SelectTime'

export default class TableAlarmDisconnect extends Component {
  columns = [
    {
      title: 'Thời gian mất tín hiệu (phút)',
      width: '15%',
      align: 'center',
      render: (value, record, index) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record._id}.${FIELDS.TIME_DISCONNECT}`,
              {
                initialValue: 30,
              }
            )(<SelectTime />)}
          </React.Fragment>
        )
      },
    },
    {
      title: 'Người nhận',
      dataIndex: 'address',
      align: 'center',
      width: '40%',
    },
    {
      title: 'Cảnh báo',
      width: '15%',
      align: 'center',
      dataIndex: 'isActive',
      render: (value, record) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record._id}.${FIELDS.STATUS}`,
              {
                initialValue: false,
                valuePropName: 'checked',
              }
            )(<Checkbox />)}
          </React.Fragment>
        )
      },
    },

    {
      title: '',
      width: '15%',
      render: (text, record) => {
        const { dataSource, handleDelete } = this.props
        const isDelete = dataSource.length >= 1

        if (!isDelete) return null

        return (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record._id)}
          >
            <div style={{ textAlign: 'center', cursor: 'pointer' }}>
              <Icon type="delete" style={{ fontSize: '16px', color: 'red' }} />
            </div>
          </Popconfirm>
        )
      },
    },
  ]

  render() {
    const { handleAdd, dataSource } = this.props
    return (
      <Table
        rowKey={record => record._id}
        columns={this.columns}
        bordered
        pagination={false}
        dataSource={dataSource}
        footer={() => (
          <Button
            type="link"
            style={{ fontWeight: 'bold' }}
            onClick={handleAdd}
          >
            <Icon type="plus" />
            Thêm
          </Button>
        )}
      />
    )
  }
}
