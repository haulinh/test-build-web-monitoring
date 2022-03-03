import { Button, Checkbox, Icon, Popconfirm, Table } from 'antd'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import React, { Component } from 'react'
import { SelectTime } from '../components'
import { FIELDS } from '../index'

export default class TableAlarmDisconnect extends Component {
  columns = [
    {
      title: 'Thời gian mất tín hiệu (phút)',
      width: '15%',
      align: 'center',
      dataIndex: FIELDS.TIME_DISCONNECT,
      render: (value, record) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record._id}.${FIELDS.TIME_DISCONNECT}`
            )(<SelectTime />)}
          </React.Fragment>
        )
      },
    },
    {
      title: 'Người nhận',
      dataIndex: 'recipients',
      align: 'center',
      width: '40%',
      render: (value, record) => {
        const { form, users, roles } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record._id}.${FIELDS.RECIPIENTS}`
            )(<TreeSelectUser users={users} roles={roles} />)}
          </React.Fragment>
        )
      },
    },
    {
      title: 'Cảnh báo',
      width: '15%',
      align: 'center',
      dataIndex: 'status',
      render: (value, record) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record._id}.${FIELDS.STATUS}`,
              {
                valuePropName: 'checked',
              }
            )(<Checkbox />)}

            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record._id}.${FIELDS.ID}`
            )(<div />)}
            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record._id}.${FIELDS.IS_CREATE_LOCAL}`
            )(<div />)}
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
            onConfirm={() => handleDelete(FIELDS.DISCONNECT, record._id)}
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
            onClick={() => handleAdd(FIELDS.DISCONNECT)}
          >
            <Icon type="plus" />
            Thêm
          </Button>
        )}
      />
    )
  }
}
