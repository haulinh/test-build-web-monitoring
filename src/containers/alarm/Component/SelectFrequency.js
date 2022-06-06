import { Select } from 'antd'
import { translate } from 'hoc/create-lang'
import React from 'react'

export const DEFAULT_VALUE_FREQUENCY = 15 * 60

const frequency = {
  '15p': {
    label: `15 ${translate('unit.time.minute')}`,
    value: 15 * 60,
  },
  '30p': {
    label: `30 ${translate('unit.time.minute')}`,
    value: 30 * 60,
  },
  '1h': {
    label: `1 ${translate('unit.time.hour')}`,
    value: 60 * 60,
  },
  '2h': {
    label: `2 ${translate('unit.time.hour')}`,
    value: 2 * 60 * 60,
  },
  '4h': {
    label: `4 ${translate('unit.time.hour')}`,
    value: 4 * 60 * 60,
  },
  '8h': {
    label: `8 ${translate('unit.time.hour')}`,
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
