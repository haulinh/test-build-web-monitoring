import { DatePicker, Table } from 'antd'
import { FormItem } from 'components/layouts/styles'
import moment from 'moment-timezone'
import React, { Component } from 'react'

const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  getColumns = () => {
    const { measureKeyListSelected, isEdit } = this.props

    const { form } = this.props

    return [
      {
        title: 'Thông số',
        dataIndex: 'measure',
        key: 'measure',
        render: value => {
          // const measureKey = measure.map(measure => measure.measure)
          return <div style={{ fontWeight: 500 }}>{value}</div>
        },
      },
      {
        title: 'Khoảng thời gian',
        key: 'time',
        render: (value, record, index) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {form.getFieldDecorator(`conditions[${value.measure}]`, {
                ...(isEdit && {
                  initialValue: [moment(value.startAt), moment(value.endAt)],
                }),
                rules: [
                  {
                    required: measureKeyListSelected.includes(value.measure),
                    message: 'Vui lòng chọn thời gian',
                  },
                ],
              })(
                <RangePicker
                  disabled={!measureKeyListSelected.includes(value.measure)}
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

  handleSelectChange = (selectedRowKeys, selectedRows) => {
    const keyListSelect = selectedRows.map(selectedRow => selectedRow.measure)
    const { form, dataSource, setMeasureKeyListSelected } = this.props

    const measureKeyList = dataSource.map(
      dataSourceItem => dataSourceItem.measure
    )

    const measureListNotSelect = measureKeyList.filter(
      measure => !keyListSelect.includes(measure)
    )

    const conditionFields = measureListNotSelect.map(
      measure => `conditions[${measure}]`
    )

    form.resetFields(conditionFields)

    setMeasureKeyListSelected(keyListSelect)
  }

  render() {
    const { dataSource, stationAuto } = this.props
    const rowSelection = {
      onChange: this.handleSelectChange,
    }

    return (
      <Table
        key={stationAuto}
        columns={[...this.getColumns()]}
        dataSource={dataSource}
        bordered
        rowSelection={rowSelection}
        pagination={false}
        scroll={{ y: 300 }}
        {...this.props}
      />
    )
  }
}
