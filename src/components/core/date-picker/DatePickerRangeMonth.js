import { DatePicker } from 'antd'
import React, { Component } from 'react'

const { RangePicker } = DatePicker

export default class DatePickerRangeMonth extends Component {
  state = {
    value: [],
    mode: ['month', 'month'],
  }

  componentDidMount = () => {
    const { value } = this.props
    this.setState({ value })
  }

  handlePanelChange = (value, mode) => {
    const { onChange } = this.props

    onChange(value)
    this.setState({
      value,
      mode: [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1],
      ],
    })
  }

  render() {
    const { value } = this.state
    return (
      <RangePicker
        placeholder={['Start month', 'End month']}
        format="MM-YYYY"
        value={value}
        mode={['month', 'month']}
        onPanelChange={this.handlePanelChange}
      />
    )
  }
}
