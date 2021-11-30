import { DatePicker, Table } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'
const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedKeyList: [],
    }
  }

  getColumns = () => {
    const { selectedKeyList } = this.state
    const { form } = this.props

    return [
      {
        title: 'Thông số',
        dataIndex: 'name',
        render: value => <div style={{ fontWeight: 500 }}>{value}</div>,
      },
      {
        title: 'Thời gian',
        render: (value, record, index) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {form.getFieldDecorator(`conditions[${value.key}]`, {
                rules: [
                  {
                    required: true,
                    message: 'Vui lòng chọn thời gian',
                  },
                ],
              })(
                <RangePicker
                  disabled={!selectedKeyList.includes(value.key)}
                  style={{ width: '100%', padding: 0 }}
                  format={['DD/MM/YYYY']}
                />
              )}
            </FormItem>
          )
        },
      },
    ]
  }

  handleSelectChange = selectedKeyList => {
    this.setState({ selectedKeyList })
  }

  render() {
    const { measureList } = this.props
    const rowSelection = {
      onChange: this.handleSelectChange,
    }
    return (
      <Table
        columns={this.getColumns()}
        dataSource={measureList}
        bordered
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ y: 300 }}
      />
    )
  }
}
