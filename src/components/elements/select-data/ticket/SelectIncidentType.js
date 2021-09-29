import { Select } from 'antd'
import React from 'react'

const options = [
  {
    name: 'Sự cố khác',
    key: 'default',
  },
  {
    name: 'Sự cố trạm quan trắc',
    key: 'station',
  },
  {
    name: 'Sự cố thông sô quan trắc',
    key: 'station_with_measure',
  },
]

export default function SelectIncidentType(props) {
  return (
    <Select style={{ width: '100%' }} {...props}>
      {options.map(option => (
        <Select.Option key={option.key} value={option.key}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  )
}
