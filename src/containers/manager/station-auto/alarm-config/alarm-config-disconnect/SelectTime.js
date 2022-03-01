import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

const times = [
  {
    id: 1,
    value: 30,
    name: '30 phút',
  },
  {
    id: 2,
    value: 60,
    name: '1 giờ',
  },
  {
    id: 3,
    value: 120,
    name: '2 giờ',
  },
  {
    id: 4,
    value: 240,
    name: '4 giờ',
  },
  {
    id: 5,
    value: 480,
    name: '8 giờ',
  },
  {
    id: 6,
    value: 1440,
    name: '1 ngày',
  },
]

export default class SelectTime extends Component {
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
