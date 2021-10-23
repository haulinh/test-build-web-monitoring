import React from 'react'
import { Switch, Select } from 'antd'
import { translate } from 'hoc/create-lang'
const { Option } = Select

function i18n() {
  return {
    only1: translate('notificationFreq.only1'),
    _5Min: translate('notificationFreq._5Min'),
    _15Min: translate('notificationFreq._15Min'),
    _30Min: translate('notificationFreq._30Min'),
    _every1Hour: translate('notificationFreq._every1Hour'),
    _every2Hour: translate('notificationFreq._every2Hour'),
    _every1Day: translate('notificationFreq._every1Day'),
    _every2Day: translate('notificationFreq._every2Day'),
  }
}

const optionSelects = () => {
  return [
    {
      title: i18n().only1,
      value: 0,
    },
    {
      title: i18n()._5Min,
      value: 5,
    },
    {
      title: i18n()._15Min,
      value: 15,
    },
    {
      title: i18n()._30Min,
      value: 30,
    },
    {
      title: i18n()._every1Hour,
      value: 60,
    },
    {
      title: i18n()._every2Hour,
      value: 120,
    },
    {
      title: i18n()._every1Day,
      value: 1440,
    },
    {
      title: i18n()._every2Day,
      value: 2880,
    },
  ]
}

const STATION_STATUS = {
  COLLECTING: 'COLLECTING',
  OFFLINE: 'OFFLINE',
  ONLINE: 'ONLINE',
}

export default class Frequency extends React.Component {
  state = {
    isEnable: this.props.isEnable,
    frequency: this.props.frequency,
  }

  getOption = () => {
    const { frequency } = this.state
    return optionSelects().find(option => option.value === frequency).value
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
    // console.log(this.state.isEnable, '------')
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
              !this.state.isEnable ||
              this.props.status === STATION_STATUS.COLLECTING ||
              this.props.status === STATION_STATUS.ONLINE
            }
            size="small"
            defaultValue={this.getOption()}
            style={{ width: 160 }}
            onChange={this.handleOnChangeSelect}
          >
            {optionSelects().map(option => (
              <Option key={option.value} value={option.value}>
                {option.title}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    )
  }
}
