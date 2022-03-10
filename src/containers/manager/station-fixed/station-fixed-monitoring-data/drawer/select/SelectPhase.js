import React, { Component } from 'react'
import { Select } from 'antd'

const { Option } = Select

export default class SelectPhase extends Component {
  render() {
    const { phases } = this.props
    console.log({ phases })

    return (
      <Select placeholder="Đợt quan trắc" style={{ width: '100%' }}>
        {/* {phases.map(phase => (
          <Option value={phase._id} key={phase._id}>
            {phase.name}
          </Option>
        ))} */}
      </Select>
    )
  }
}
