import { DatePicker, Table } from 'antd'
import { FormItem } from 'components/layouts/styles'
import moment from 'moment'
import React, { Component } from 'react'

const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  setInitValues = () => {
    const { form } = this.props
    const conditionFields = this.getFieldsConditionsValue()
    form.setFieldsValue({ conditions: conditionFields })
  }

  componentDidUpdate = prevProps => {
    const { isEdit } = this.props
    if (isEdit) {
      const { id, form } = this.props
      if (prevProps.id !== id) {
        const conditionFields = this.getFieldsConditionsValue()
        form.setFieldsValue({ conditions: conditionFields })
      }
    }
  }

  getFieldsConditionsValue = () => {
    const { conditions } = this.props
    if (!conditions) return
    const conditionFields = conditions.reduce((prevValue, currentValue) => {
      return {
        ...prevValue,
        [currentValue.measure]: [
          moment(currentValue.startAt),
          moment(currentValue.endAt),
        ],
      }
    }, {})
    return conditionFields
  }

  getColumns = () => {
    const { measureKeyListSelected, measuresObj, form } = this.props

    return [
      {
        title: 'Thông số',
        dataIndex: 'measure',
        key: 'measure',
        render: value => {
          return (
            <div style={{ fontWeight: 500 }}>{measuresObj[value].name}</div>
          )
        },
      },
      {
        title: 'Khoảng thời gian',
        key: 'time',
        render: (value, record, index) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {form.getFieldDecorator(`conditions.${value.measure}`, {
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
                  showTime={{ format: 'HH:mm' }}
                  format="HH:mm DD-MM-YYYY"
                  placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
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
      measure => `conditions.${measure}`
    )

    form.resetFields(conditionFields)

    setMeasureKeyListSelected(keyListSelect)
  }

  render() {
    const { dataSource, stationAuto, measureKeyListSelected } = this.props

    const rowSelection = {
      selectedRowKeys: measureKeyListSelected,
      onChange: this.handleSelectChange,
    }
    return (
      <Table
        key={stationAuto}
        rowKey={row => row.measure}
        columns={this.getColumns()}
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
