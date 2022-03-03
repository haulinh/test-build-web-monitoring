import { Button, Checkbox, Icon, Popconfirm, Table } from 'antd'
import React, { Component } from 'react'
import SelectUser from 'components/elements/select-data/SelectUser'
import { FIELDS } from '../index'
import { SelectQCVNExceed } from '../components'

export default class TableAlarmConfigExceed extends Component {
  columns = [
    {
      title: 'Ngưỡng',
      dataIndex: 'name',
      width: '15%',
      align: 'left',
      render: (value, record, index) => {
        const { form, qcvnList } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.STANDARD_ID}`
            )(
              <SelectQCVNExceed placeholder="Chọn ngưỡng" qcvnList={qcvnList} />
            )}
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
        const { form } = this.props
        return (
          <React.Fragment>
            {form.getFieldDecorator(
              `${FIELDS.BY_STANDARD}.${record._id}.${FIELDS.RECIPIENTS}`
            )(<SelectUser mode="multiple" />)}
          </React.Fragment>
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
          <React.Fragment>
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
          </React.Fragment>
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
            disabled={dataSource.length > 2}
          >
            <Icon type="plus" />
            Thêm
          </Button>
        )}
      />
    )
  }
}
