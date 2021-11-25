import React, { Component } from 'react'
import { Table, DatePicker } from 'antd'
import { FormItem } from 'components/layouts/styles'
const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  constructor(props) {
    super(props)
    const { form } = this.props
    this.state = {
      conditons: [],
    }
    this.columns = [
      {
        title: 'Thông số',
        render: (value, record, index) => {
          return <div>{value.key}</div>
        },
      },
      {
        title: 'Thời gian',
        render: (value, record, index) => {
          return (
            <FormItem>
              {form.getFieldDecorator(`conditions[${value.key}]`, {
                initialValue: [],
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn thời gian',
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          )
        },
      },
    ]
    this.columnsModalEdit = [
      ...this.columns,
      {
        title: 'Trạng thái',
        render: () => <div>Áp dụng</div>,
      },
    ]
  }
  rowSelection = {}
  render() {
    const { measureList, modalType } = this.props
    return (
      <Table
        columns={modalType === 'edit' ? this.columnsModalEdit : this.columns}
        dataSource={measureList}
        bordered
        rowSelection={this.rowSelection}
        pagination={false}
        scroll={{ y: 300 }}
      />
    )
  }
}
