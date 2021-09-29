import { Select } from 'antd'
import React from 'react'
import { translate as t } from 'hoc/create-lang'

const options = [
  {
    name: () => t('ticket.incidentType.default'),
    key: 'default',
  },
  {
    name: () => t('ticket.incidentType.station'),
    key: 'station',
  },
  {
    name: () => t('ticket.incidentType.measure'),
    key: 'station_with_measure',
  },
]

export default function SelectIncidentType(props) {
  return (
    <Select style={{ width: '100%' }} {...props}>
      {options.map(option => (
        <Select.Option key={option.key} value={option.key}>
          {option.name()}
        </Select.Option>
      ))}
    </Select>
  )
}
