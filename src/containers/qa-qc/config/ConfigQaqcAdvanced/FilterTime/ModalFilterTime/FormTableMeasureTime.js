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
        render: (value, record) => {
          return (
            <React.Fragment>
              {form.getFieldDecorator(value.key)(<div>{value.key}</div>)}
            </React.Fragment>
          )
        },
      },
      {
        title: 'Thời gian',
        render: value => {
          return (
            <React.Fragment>
              {form.getFieldDecorator(value.key)(
                <RangePicker style={{ width: '100%' }} />
              )}
            </React.Fragment>
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
  rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows)
    },
  }
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
