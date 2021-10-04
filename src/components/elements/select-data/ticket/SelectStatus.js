import React, { Component } from 'react'
import CalculateApi from 'api/CalculateApi'
import { Select } from 'antd'
import styled from 'styled-components'

const SelectWrapper = styled(Select)`
  .ant-select-selection--single {
    background: ${props => props.background} !important;
    border-color: ${props => props.color} !important;
  }
  .ant-select-selection-selected-value {
    color: ${props => props.color} !important;
  }
  .ant-select-arrow {
    color: ${props => props.color} !important;
  }
`

export default class SelectStatus extends Component {
  state = {
    options: [],
  }

  async componentDidMount() {
    const data = await CalculateApi.getStatusTicket()
    this.setState({ options: data })
  }

  getStatus = () => {
    const { options } = this.state
    const { value = {} } = this.props
    return options.find(item => item._id === value) || {}
  }

  handleOnChange = value => {
    const { onChange } = this.props
    onChange(value)
  }

  render() {
    const { options } = this.state
    const status = this.getStatus()

    return (
      <SelectWrapper
        {...this.props}
        style={{ width: 120 }}
        background={status.background}
        onChange={this.handleOnChange}
        color={status.color}
      >
        {options.map(option => (
          <Select.Option key={option._id} value={option._id}>
            {option.name}
          </Select.Option>
        ))}
      </SelectWrapper>
    )
  }
}
