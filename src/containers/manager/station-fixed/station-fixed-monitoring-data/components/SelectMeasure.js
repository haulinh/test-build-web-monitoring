import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

export default class SelectMeasure extends Component {
  render() {
    const { measuringList } = this.props

    return (
      <Select
        {...this.props}
        placeholder="Thong so"
        style={{ width: '100%' }}
        getPopupContainer={trigger => trigger.parentNode}
      >
        {measuringList.map(measure => (
          <Option
            value={measure.key}
            key={measure.key}
            disabled={measure.disabled}
          >
            {measure.name}
          </Option>
        ))}
      </Select>
    )
  }
}
