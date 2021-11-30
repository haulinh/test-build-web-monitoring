import React, { Component } from 'react'
import { Table, DatePicker } from 'antd'
import { FormItem } from 'components/layouts/styles'
const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  constructor(props) {
    super(props)
    const { form } = this.props
    this.state = {
      selectedRowKeys: [],
      isSelected: false,
      attribute: {
        name: 'name',
        isActive: true,
        eventId: 1,
      },
    }
    this.columns = [
      {
        title: 'Thông số',
        render: (value, record, index) => {
          return (
            <div>
              {form.getFieldDecorator(`measure[${index}]`, {
                initialValue: {
                  name: value.name,
                  key: value.key,
                },
              })(<div>{value.name}</div>)}
            </div>
          )
        },
      },
      {
        title: 'Thời gian',
        render: (value, record, index) => {
          return (
            <FormItem>
              {form.getFieldDecorator(`conditions[${value.key}]`, {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn thời gian',
                  },
                ],
              })(
                <RangePicker
                  style={{ width: '100%' }}
                  format={['DD/MM/YYYY']}
                />
              )}
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

  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys changed: ', selectedRowKeys)
    this.setState({ selectedRowKeys })
  }
  render() {
    const { measureList, modalType } = this.props
    const rowSelection = {
      onChange: this.onSelectChange,
    }
    return (
      <Table
        columns={modalType === 'edit' ? this.columnsModalEdit : this.columns}
        dataSource={measureList}
        bordered
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ y: 300 }}
      />
    )
  }
}
