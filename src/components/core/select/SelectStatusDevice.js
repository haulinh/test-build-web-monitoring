import React from 'react'
import { Select } from 'antd'
import { translate as t } from 'hoc/create-lang'

const { Option } = Select

export const optionsStatusDevice = [
  {
    label: t('dataSearchFrom.form.statusDevice.option.error'),
    value: 'Error',
  },
  {
    label: t('dataSearchFrom.form.statusDevice.option.calibration'),
    value: 'Calibration',
  },
  {
    label: t('dataSearchFrom.form.statusDevice.option.good'),
    value: 'Good',
  },
]

export const statusDeviceList = optionsStatusDevice.map(status => status.value)

export const SelectStatusDevice = props => {
  const options = optionsStatusDevice.map(status => (
    <Option key={status.value} value={status.value}>
      {status.label}
    </Option>
  ))

  return (
    <Select style={{ width: '100%' }} {...props} mode="multiple">
      {options}
    </Select>
  )
}
