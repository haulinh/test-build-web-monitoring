import React from 'react'
import { Select } from 'antd'

const SelectMeasureParameter = ({
  measuringList = [],
  value,
  onChange,
  ...props
}) => {
  const handleChange = keys => {
    onChange(keys)
  }

  return (
    <Select
      mode="multiple"
      {...props}
      value={value}
      maxTagCount={20}
      maxTagTextLength={15}
      style={{ width: '100%' }}
      onChange={handleChange}
    >
      {measuringList.map(item => (
        <Select.Option key={item.key} value={item.key}>
          {item.name}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectMeasureParameter
