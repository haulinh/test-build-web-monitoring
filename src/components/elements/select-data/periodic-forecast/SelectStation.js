import { Select } from 'antd'
import PeriodicForecastApi from 'api/station-fixed/PeriodicForecastApi'
import React, { Component } from 'react'

export default class SelectStation extends Component {
  state = {
    stations: [],
  }

  async componentDidMount() {
    const result = await PeriodicForecastApi.getStationPeriodicForecast({})
    this.setState({ stations: result.data })
  }

  render() {
    const { stations } = this.state
    const { onChange, value } = this.props || {}
    return (
      <Select
        onChange={onChange}
        value={value}
        style={{ width: '100%' }}
        mode="multiple"
      >
        {stations.map(station => (
          <Select.Option key={station.key} value={station.key}>
            {station.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
