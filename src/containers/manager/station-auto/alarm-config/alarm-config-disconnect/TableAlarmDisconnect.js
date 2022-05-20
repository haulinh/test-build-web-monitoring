import { Button, Checkbox, Icon, Popconfirm, Table } from 'antd'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import React, { Component } from 'react'
import { SelectTime } from '../components'
import { i18n } from '../constants'
import { FIELDS } from '../index'

export default class TableAlarmDisconnect extends Component {
  columns = [
    {
      title: i18n().timeLabel,
      width: '15%',
      align: 'left',
      dataIndex: FIELDS.TIME_DISCONNECT,
      render: (_, record) => {
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.DISCONNECT}.${record._id}.${FIELDS.TIME_DISCONNECT}`,
              {
                initialValue: 1800,
              }
            )(<SelectTime />)}
          </React.Fragment>
        )
      },
    },
    {
      title: i18n().recipient,
      dataIndex: 'recipients',
      align: 'center',
      width: '40%',
      render: (_, record) => {
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
      title: i18n().alarm,
      width: '15%',
      align: 'center',
      dataIndex: 'status',
      render: (_, record) => {
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
            title={i18n().popConfirmDelete}
            okText={i18n().button.submit}
            cancelText={i18n().button.cancel}
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
            {i18n().button.add}
          </Button>
        )}
      />
    )
  }
}
