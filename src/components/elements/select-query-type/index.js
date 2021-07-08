import { Select } from 'antd'
import { translate } from 'hoc/create-lang'
import React from 'react'

const options = [
  { key: 'origin', label: translate('qaqc.originalData') },
  { key: 'invalid', label: translate('qaqc.validData') },
  { key: 'valid', label: translate('qaqc.inValidData') },
]

const SelectQueryType = ({ onChange, value }) => {
  const handleOnChange = key => {
    onChange(key)
  }

  return (
    <Select style={{ width: '100%' }} onChange={handleOnChange} value={value}>
      {options.map(item => (
        <Select.Option key={item.key} value={item.key}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectQueryType
