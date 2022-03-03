import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

const times = [
  {
    id: 1,
    value: 30 * 60,
    name: '30 phút',
  },
  {
    id: 2,
    value: 60 * 60,
    name: '1 giờ',
  },
  {
    id: 3,
    value: 2 * 60 * 60,
    name: '2 giờ',
  },
  {
    id: 4,
    value: 4 * 60 * 60,
    name: '4 giờ',
  },
  {
    id: 5,
    value: 8 * 60 * 60,
    name: '8 giờ',
  },
  {
    id: 6,
    value: 24 * 60 * 60,
    name: '1 ngày',
  },
]

export class SelectTime extends Component {
  render() {
    return (
      <Select {...this.props}>
        {times.map(time => (
          <Option key={time.id} value={time.value}>
            {time.name}
          </Option>
        ))}
      </Select>
    )
  }
}
