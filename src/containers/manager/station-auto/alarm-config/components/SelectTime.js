import React, { Component } from 'react'
import { Select } from 'antd'
import { i18n } from '../constants'

const { Option } = Select

const times = [
  {
    id: 1,
    value: 30 * 60,
    name: () => `30 ${i18n().time.minute}`,
  },
  {
    id: 2,
    value: 60 * 60,
    name: () => `1 ${i18n().time.hour}`,
  },
  {
    id: 3,
    value: 2 * 60 * 60,
    name: () => `2 ${i18n().time.hour}`,
  },
  {
    id: 4,
    value: 4 * 60 * 60,
    name: () => `4 ${i18n().time.hour}`,
  },
  {
    id: 5,
    value: 8 * 60 * 60,
    name: () => `8 ${i18n().time.hour}`,
  },
  {
    id: 6,
    value: 24 * 60 * 60,
    name: () => `1 ${i18n().time.day}`,
  },
]

export class SelectTime extends Component {
  render() {
    return (
      <Select {...this.props}>
        {times.map(time => (
          <Option key={time.id} value={time.value}>
            {time.name()}
          </Option>
        ))}
      </Select>
    )
  }
}
