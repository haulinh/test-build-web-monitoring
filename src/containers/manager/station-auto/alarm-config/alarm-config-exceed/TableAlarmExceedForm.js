import { Button, Checkbox, Icon, Popconfirm, Table, Form } from 'antd'
import React, { Component } from 'react'
import { SelectQCVNExceed } from '../components'
import { FIELDS } from '../index'
import TreeSelectUser from 'components/elements/select-data/TreeSelectUser'
import { i18n } from '../constants'

export default class TableAlarmConfigExceed extends Component {
  onChangeSelectUser = (value, id) => {
    return
  }

  columns = [
    {
      title: i18n().threshold,
      dataIndex: 'name',
      width: '15%',
      align: 'left',
      render: (value, record, index) => {
        const { form, qcvnList, qcvnListSelected } = this.props
        return (
          <Form.Item>
            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.STANDARD_ID}`
            )(
              <SelectQCVNExceed
                placeholder={i18n().selectThreshold}
                qcvnList={qcvnList}
                selectedQCVNList={qcvnListSelected}
              />
            )}
          </Form.Item>
        )
      },
    },
    {
      title: i18n().recipient,
      dataIndex: 'recipients',
      align: 'center',
      width: '40%',
      render: (value, record, index) => {
        const { form, users, roles } = this.props
        return (
          <Form.Item>
            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.RECIPIENTS}`
            )(<TreeSelectUser users={users} roles={roles} />)}
          </Form.Item>
        )
      },
    },
    {
      title: i18n().alarm,
      width: '15%',
      align: 'center',
      dataIndex: 'isActive',
      render: (value, record) => {
        const { form } = this.props
        return (
          <Form.Item>
            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.STATUS}`,
              {
                valuePropName: 'checked',
              }
            )(<Checkbox />)}

            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.ID}`
            )(<div />)}
            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.IS_CREATE_LOCAL}`
            )(<div />)}
          </Form.Item>
        )
      },
    },
    {
      title: '',
      width: '15%',
      render: (text, record) => {
        const { dataSource, onDelete } = this.props
        const disabled = dataSource.length >= 1
        if (disabled) {
          return (
            <Popconfirm
              title={i18n().popConfirmDelete}
              okText={i18n().button.submit}
              cancelText={i18n().button.cancel}
              onConfirm={() => onDelete(FIELDS.BY_STANDARD, record._id)}
            >
              <div style={{ textAlign: 'center', cursor: 'pointer' }}>
                <Icon
                  type="delete"
                  style={{ fontSize: '16px', color: 'red' }}
                />
              </div>
            </Popconfirm>
          )
        }
      },
    },
  ]

  render() {
    const { dataSource, onAdd } = this.props

    return (
      <Table
        columns={this.columns}
        rowKey={record => record._id}
        dataSource={dataSource}
        bordered
        pagination={false}
        footer={() => (
          <Button
            type="link"
            style={{ fontWeight: 'bold' }}
            onClick={() => onAdd(FIELDS.BY_STANDARD)}
          >
            <Icon type="plus" />
            {i18n().button.add}
          </Button>
        )}
      />
    )
  }
}
