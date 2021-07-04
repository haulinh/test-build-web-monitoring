import { Select } from 'antd'
import { translate } from 'hoc/create-lang'
import React from 'react'

const options = [
  { key: 'RAW', label: translate('qaqc.originalData') },
  { key: 'QCVN', label: translate('qaqc.validData') },
  { key: 'ANTI_QCVN', label: translate('qaqc.inValidData') },
]

const SelectQueryType = ({ onChange }) => {
  const handleOnChange = key => {
    onChange(key)
  }

  return (
    <Select onChange={handleOnChange}>
      {options.map(item => (
        <Select.Option key={item.key} value={item.key}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectQueryType
