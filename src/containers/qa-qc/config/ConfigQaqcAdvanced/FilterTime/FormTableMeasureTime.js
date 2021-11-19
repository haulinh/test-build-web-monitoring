import React, { Component } from 'react'
import { Table, DatePicker } from 'antd'

const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  columns = [
    {
      title: 'Thông số',
      render: record => {
        return (
          <React.Fragment>
            {this.props.form.getFieldDecorator(record.key)(
              <div> {record.key}</div>
            )}
          </React.Fragment>
        )
      },
    },
    {
      title: 'Thời gian',
      render: record => {
        const onChangeTime = value => {
          this.props.form.setFieldsValue({
            [record.key]: value,
          })
        }
        return <RangePicker style={{ width: '100%' }} onChange={onChangeTime} />
      },
    },
  ]
  render() {
    return (
      <Table
        columns={this.columns}
        dataSource={this.props.measureList}
        bordered
        pagination={false}
        scroll={{ y: 300 }}
      />
    )
  }
}
