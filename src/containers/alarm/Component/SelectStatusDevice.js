import { Select } from 'antd'
import { translate } from 'hoc/create-lang'
import React from 'react'

const deviceStatus = {
  good: {
    label: () => translate('alarm.label.management.deviceStatus.good'),
    value: 0,
  },
  calibration: {
    label: () => translate('alarm.label.management.deviceStatus.calibration'),
    value: 1,
  },
  error: {
    label: () => translate('alarm.label.management.deviceStatus.error'),
    value: 2,
  },
}

const SelectStatusDevice = props => {
  return (
    <Select {...props}>
      {Object.values(deviceStatus).map(deviceStatusItem => (
        <Select.Option
          value={deviceStatusItem.value}
          key={deviceStatusItem.value}
        >
          {deviceStatusItem.label()}
        </Select.Option>
      ))}
    </Select>
  )
}

export default SelectStatusDevice
