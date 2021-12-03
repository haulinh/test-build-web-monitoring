import { DatePicker, Table } from 'antd'
import { FormItem } from 'components/layouts/styles'
import _ from 'lodash'
import React, { Component } from 'react'

const { RangePicker } = DatePicker

export default class FormTableMeasureTime extends Component {
  getColumns = () => {
    const { measureKeyListSelected } = this.props

    const { form } = this.props

    return [
      // {
      //   title: 'Thông số',
      //   dataIndex: 'conditions.measure',
      //   key: 'measure',
      //   render: value => {
      //     console.log({ value })
      //     // const measureKey = measure.map(measure => measure.measure)
      //     // return <div style={{ fontWeight: 500 }}>{measure}</div>
      //   },
      // },
      // {
      //   title: 'Khoảng thời gian',
      //   render: (value, record, index) => {
      //     return (
      //       <FormItem style={{ marginBottom: 0 }}>
      //         {form.getFieldDecorator(`conditions[${value.key}]`, {
      //           initialValue: [],
      //           rules: [
      //             {
      //               required: measureKeyListSelected.includes(value.key),
      //               message: 'Vui lòng chọn thời gian',
      //             },
      //           ],
      //         })(
      //           <RangePicker
      //             disabled={!measureKeyListSelected.includes(value.key)}
      //             style={{ width: '100%', padding: 0 }}
      //             format={['DD/MM/YYYY']}
      //           />
      //         )}
      //       </FormItem>
      //     )
      //   },
      // },
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

    setMeasureKeyListSelected(keyListSelect)
  }

  render() {
    const { dataSource, stationAuto, modalType } = this.props
    const rowSelection = {
      onChange: this.handleSelectChange,
    }

    return (
      <Table
        key={stationAuto}
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
