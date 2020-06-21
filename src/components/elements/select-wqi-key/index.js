import React, { Component } from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import { get as _get } from 'lodash'
import { getListConfigWqi } from 'api/CategoryApi'

export default class SelectWqiKey extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    getRef: PropTypes.func,
  }

  state = {
    value: undefined,
    wqiConfig: [],
  }

  async componentDidMount() {
    const wqiConfigListRes = await getListConfigWqi()
    let wqiConfigList = _get(wqiConfigListRes, 'data.value', [])
    wqiConfigList = wqiConfigList.filter(item => item.activated)

    this.setState({
      wqiConfig: wqiConfigList,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { onChange, onChangeVal } = this.props
    if (onChange && prevState.value !== this.state.value) {
      onChange(this.state.value)
    }
    if (onChangeVal && prevState.value !== this.state.value) {
      onChangeVal(this.state.value)
    }
  }

  render() {
    const { wqiConfig } = this.state
    const { size } = this.props

    return (
      <Select
        size={size}
        showSearch
        onSearch={this.handleSearch}
        style={{ width: '100%' }}
        onChange={value => this.setState({ value })}
        value={this.state.value}
        filterOption={false}
      >
        {wqiConfig.map(config => (
          <Select.Option value={config.key}>{config.name}</Select.Option>
        ))}
      </Select>
    )
  }
}
