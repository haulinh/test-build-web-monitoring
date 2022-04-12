import { Select } from 'antd'
import React from 'react'

export const DEFAULT_VALUE_FREQUENCY = 15 * 60

const frequency = {
  '15p': {
    label: '15p',
    value: 15 * 60,
  },
  '30p': {
    label: '30p',
    value: 30 * 60,
  },
  '1h': {
    label: '1h',
    value: 60 * 60,
  },
  '2h': {
    label: '2h',
    value: 2 * 60 * 60,
  },
  '4h': {
    label: '4h',
    value: 4 * 60 * 60,
  },
  '8h': {
    label: '8h',
    value: 8 * 60 * 60,
  },
}

const SelectFrequency = props => {
  return (
    <Select {...props}>
      {Object.values(frequency).map(frequencyItem => (
        <Select.Option value={frequencyItem.value} key={frequencyItem.value}>
          {frequencyItem.label}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectFrequency
