import React from 'react'
import { Switch, Select } from 'antd'

const { Option } = Select

const optionSelects = [
  {
    title: 'Chỉ 1 lần',
    value: 0,
  },
  {
    title: 'Mỗi 5 phút',
    value: 5,
  },
  {
    title: 'Mỗi 15 phút',
    value: 15,
  },
  {
    title: 'Mỗi 30 phút',
    value: 30,
  },
  {
    title: 'Mỗi tiếng',
    value: 60,
  },
  {
    title: 'Mỗi 2 tiếng',
    value: 120,
  },
  {
    title: 'Mỗi ngày',
    value: 1440,
  },
  {
    title: 'Mỗi 2 ngày',
    value: 2880,
  },
]

const STATION_STATUS = {
  COLLECTING: 'COLLECTING',
  OFFLINE: 'OFFLINE'
}

export default class Frequency extends React.Component {
  state = {
    isEnable: this.props.isEnable,
    frequency: this.props.frequency,
  }

  getOption = () => {
    const { frequency } = this.state
    return optionSelects.find(option => option.value === frequency).value
  }

  handleOnChange = value => {
    this.setState({ isEnable: value }, () => {
      const frequencyUpdate = {
        _id: this.props._id,
        ...this.state,
      }

      this.props.updateFrequency(frequencyUpdate)
    })
  }

  handleOnChangeSelect = value => {
    this.setState({ frequency: value }, () => {
      const frequencyUpdate = {
        _id: this.props._id,
        ...this.state,
      }

      this.props.updateFrequency(frequencyUpdate)
    })
  }

  render() {
    console.log(this.state.isEnable, '------')
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ paddingRight: '8px' }}>
          <Switch
            checkedChildren="ON"
            unCheckedChildren="OFF"
            checked={this.state.isEnable}
            onChange={this.handleOnChange}
          />
        </div>
        <div>
          <Select
            disabled={
              !this.state.isEnable || this.props.status === STATION_STATUS.COLLECTING || this.props.status === STATION_STATUS.OFFLINE
            }

            size="small"
            defaultValue={this.getOption()}
            style={{ width: 120 }}
            onChange={this.handleOnChangeSelect}
          >
            {optionSelects.map(option => (
              <Option value={option.value}>{option.title}</Option>
            ))}
          </Select>
        </div>
      </div>
    )
  }
}
