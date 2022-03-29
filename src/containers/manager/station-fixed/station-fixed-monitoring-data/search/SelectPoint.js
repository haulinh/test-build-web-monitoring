import { Select } from 'antd'
import React from 'react'

export default class SelectPoint extends React.Component {
  render() {
    const { label, points } = this.props
    return (
      <Select
        {...this.props}
        autoClearSearchValue
        allowClear
        optionFilterProp="children"
        // this props allow search name and _id
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0 ||
          option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        style={{ width: '100%' }}
        placeholder={label}
      >
        {points.map(point => (
          <Select.Option key={point.key} value={point._id}>
            {point.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
