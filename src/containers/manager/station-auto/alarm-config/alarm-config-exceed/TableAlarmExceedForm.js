import { Button, Checkbox, Icon, Popconfirm, Table, Form } from 'antd'
import React, { Component } from 'react'
import { SelectQCVNExceed } from '../components'
import { FIELDS } from '../index'
import SelectUser from 'components/elements/select-data/SelectUser'

export default class TableAlarmConfigExceed extends Component {
  onChangeSelectUser = (value, id) => {
    return
  }

  columns = [
    {
      title: 'Ngưỡng',
      dataIndex: 'name',
      width: '15%',
      align: 'left',
      render: (value, record, index) => {
        const { form, qcvnList, qcvnListSelected } = this.props
        return (
          <Form.Item>
            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.STANDARD_ID}`,
              {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn ngưỡng',
                  },
                ],
              }
            )(
              <SelectQCVNExceed
                placeholder="Chọn ngưỡng"
                qcvnList={qcvnList}
                selectedQCVNList={qcvnListSelected}
              />
            )}
          </Form.Item>
        )
      },
    },
    {
      title: 'Người nhận',
      dataIndex: 'recipients',
      align: 'center',
      width: '40%',
      render: (value, record, index) => {
        const { form, users, roles } = this.props
        return (
          <Form.Item>
            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.RECIPIENTS}`,
              {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn ít nhất một user',
                  },
                ],
              }
            )(<SelectUser mode="multiple" />)}
          </Form.Item>
        )
      },
    },
    {
      title: 'Cảnh báo',
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
              title="Sure to delete?"
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
            Thêm
          </Button>
        )}
      />
    )
  }
}
