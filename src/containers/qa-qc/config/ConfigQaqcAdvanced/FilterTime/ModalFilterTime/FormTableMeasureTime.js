import { DatePicker, Table } from 'antd'
import { FormItem } from 'components/layouts/styles'
import React, { Component } from 'react'

const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyListSelect: [],
    }
  }

  getColumns = () => {
    const { measureKeyListSelected } = this.props

    const { form } = this.props

    return [
      {
        title: 'Thông số',
        dataIndex: 'name',
        render: value => <div style={{ fontWeight: 500 }}>{value}</div>,
      },
      {
        title: 'Khoảng thời gian',
        render: (value, record, index) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {form.getFieldDecorator(`conditions[${value.key}]`, {
                initialValue: [],
                rules: [
                  {
                    required: measureKeyListSelected.includes(value.key),
                    message: 'Vui lòng chọn thời gian',
                  },
                ],
              })(
                <RangePicker
                  disabled={!measureKeyListSelected.includes(value.key)}
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

  handleSelectChange = keyListSelect => {
    const { form, measureList, setMeasureKeyListSelected } = this.props

    const measureKeyList = measureList.map(measure => measure.key)

    const measureListNotSelect = measureKeyList.filter(
      measure => !keyListSelect.includes(measure)
    )

    const conditionFields = measureListNotSelect.map(
      measure => `conditions[${measure}]`
    )

    form.resetFields(conditionFields)

    this.setState({ keyListSelect })

    setMeasureKeyListSelected(keyListSelect)
  }

  render() {
    const { measureList, stationAuto } = this.props
    const rowSelection = {
      onChange: this.handleSelectChange,
    }

    return (
      <Table
        key={stationAuto}
        columns={this.getColumns()}
        dataSource={measureList}
        bordered
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ y: 300 }}
        {...this.props}
      />
    )
  }
}
