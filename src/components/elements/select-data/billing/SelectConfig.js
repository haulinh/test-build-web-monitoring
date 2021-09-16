import { Select } from 'antd'
import DataInsight from 'api/DataInsight'
import React, { Component } from 'react'

export default class SelectConfig extends Component {
  state = {
    configs: [],
  }

  async componentDidMount() {
    const result = await DataInsight.getConfigBilling()
    this.setState({ configs: result })
  }

  render() {
    const { configs } = this.state
    const { onChange, value } = this.props || {}
    return (
      <Select
        onChange={onChange}
        allowClear
        value={value}
        style={{ width: '100%' }}
      >
        {configs.map(config => (
          <Select.Option key={config._id} value={config._id}>
            {config.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
