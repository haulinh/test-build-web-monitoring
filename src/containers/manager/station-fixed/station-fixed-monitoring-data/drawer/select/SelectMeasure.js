import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

export default class SelectMeasure extends Component {
  render() {
    const { measuringList, value } = this.props
    console.log({ value })

    return (
      <Select {...this.props} placeholder="Thong so" style={{ width: '100%' }}>
        {measuringList.map(measure => (
          <Option value={measure.key} key={measure.key}>
            {measure.name}
          </Option>
        ))}
      </Select>
    )
  }
}
