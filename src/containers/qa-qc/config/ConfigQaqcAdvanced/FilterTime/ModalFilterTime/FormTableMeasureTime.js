import React, { Component } from 'react'
import { Table, DatePicker } from 'antd'

const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  constructor(props) {
    super(props)
    const { form } = this.props

    this.columns = [
      {
        title: 'Thông số',
        render: record => {
          return (
            <React.Fragment>
              {form.getFieldDecorator(record.key)(<div>{record.key}</div>)}
            </React.Fragment>
          )
        },
      },

      {
        title: 'Thời gian',
        render: record => {
          return (
            <React.Fragment>
              {form.getFieldDecorator(record.key)(
                <RangePicker style={{ width: '100%' }} />
              )}
            </React.Fragment>
          )
        },
      },
    ]
  }

  render() {
    const { measureList } = this.props

    return (
      <Table
        columns={this.columns}
        dataSource={measureList}
        bordered
        pagination={false}
        scroll={{ y: 300 }}
      />
    )
  }
}
