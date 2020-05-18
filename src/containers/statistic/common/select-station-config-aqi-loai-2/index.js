import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Select } from 'antd'
import stationConfigApi from 'api/StationConfigApi'
import * as _ from 'lodash'

@autobind
export default class SelectStationConfigAQILoai2 extends React.Component {
  static propTypes = {
    stationTypeKey: PropTypes.string,
    onChangeObject: PropTypes.func,
    provinceKey: PropTypes.string,
    isMultiple: PropTypes.bool
  }

  state = {
    isLoaded: false,
    stationConfigSelects: []
  }

  async componentWillMount() {
    const responseStationConfig = await stationConfigApi.getStationsConfig(
      {},
      { config: 'AQI' }
    )
    this.setState({
      stationConfigSelects: responseStationConfig.data,
      isLoaded: true
    })
  }

  getStationAutos() {
    return _.filter(this.state.stationConfigSelects, stationConfig => {
      return (
        _.isEqual(
          this.props.stationTypeKey,
          _.get(stationConfig, 'stationType.key', null)
        ) &&
        (!this.props.provinceKey ||
          _.isEqual(
            this.props.provinceKey,
            _.get(stationConfig, 'province.key', null)
          ))
      )
    })
  }

  handleChange(stationTypeValue) {
    if (this.props.isMultiple) {
      this.props.onChange(stationTypeValue)
      if (this.props.onChangeObject) {
        this.props.onChangeObject(_.join(stationTypeValue, ','))
      }
    } else {
      const stationType = this.state.stationConfigSelects.find(
        s => s.key === stationTypeValue
      )
      this.props.onChange(stationTypeValue)
      if (this.props.onChangeObject) {
        this.props.onChangeObject(stationType)
      }
    }
  }

  render() {
    if (!this.state.isLoaded) return <div />
    return (
      <Select
        {...this.props}
        onChange={this.handleChange}
        mode={this.props.isMultiple ? 'multiple' : false}
        showSearch
        value={this.props.value ? this.props.value : []}
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
