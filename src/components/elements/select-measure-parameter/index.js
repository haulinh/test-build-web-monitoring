import React from 'react'
import { Select } from 'antd'
import _ from 'lodash'

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
      showSearch
      maxTagCount={5}
      maxTagTextLength={5}
      style={{ width: '100%' }}
      onChange={handleChange}
      optionFilterProp="children"
      filterOption={(input, option) =>
        _.get(option, 'props.children', '')
          .toLowerCase()
          .indexOf((input || '').toLowerCase()) >= 0
      }
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
