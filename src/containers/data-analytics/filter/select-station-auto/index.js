import React from 'react'
import { Select } from 'antd'
import PropTypes from 'prop-types'

import StationAutoApi from 'api/StationAuto'
import { get } from 'lodash'

export default class SelectStationAuto extends React.Component {
  static propTypes = {
    stationTypeKey: PropTypes.string,
  }

  state = {
    stationAutos: [],
  }

  async componentDidMount() {
    const { onFetchSuccess } = this.props
    const results = await StationAutoApi.getStationAutos(
      { itemPerPage: 1000 },
      { isAuto: true }
    )
    if (typeof onFetchSuccess === 'function') onFetchSuccess(results.data)
    this.setState({ stationAutos: results.data })
  }

  handleChange = keys => {
    const { onChange } = this.props
    onChange(keys)
  }

  getStationAutos = () => {
    const { stationAutos } = this.state
    const { stationType, province } = this.props

    return stationAutos
      .filter(item => get(item, 'stationType.key') === stationType)
      .filter(item =>
        province ? get(item, 'province.key') === province : true
      )
  }

  render() {
    const { value } = this.props
    return (
      <Select
        mode="multiple"
        value={value}
        maxTagCount={20}
        maxTagTextLength={15}
        style={{ width: '100%' }}
        onChange={this.handleChange}
      >
        {this.getStationAutos().map(item => (
          <Select.Option key={item.key} value={item.key}>
            {item.name}
          </Select.Option>
        ))}
      </Select>
    )
  }
}
