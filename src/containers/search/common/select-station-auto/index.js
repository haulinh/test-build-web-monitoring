import React from 'react'
import PropTypes from 'prop-types'
import { autobind } from 'core-decorators'
import { Select } from 'antd'
import StationAutoApi from 'api/StationAuto'
import * as _ from 'lodash'

@autobind
export default class SelectStationAuto extends React.Component {
  static propTypes = {
    stationTypeKey: PropTypes.string,
    onChangeObject: PropTypes.func,
    provinceKey:  PropTypes.string
  }

  state = {
    isLoaded: false,
    stationAutoSelects: []
  }

  async componentWillMount() {
    const responseStationAuto = await StationAutoApi.getStationAutos({
      page: 1,
      itemPerPage: 10000000
    })

    this.setState({
      stationAutoSelects: responseStationAuto.data,
      isLoaded: true
    })
  }

  getStationAutos(){
    return _.filter(this.state.stationAutoSelects, stationAuto => {
      return _.isEqual(this.props.stationTypeKey, _.get(stationAuto, 'stationType.key', null)) &&
             (!this.props.provinceKey || _.isEqual(this.props.provinceKey, _.get(stationAuto, 'province.key', null)))
    })
  }

  handleChange(stationTypeValue) {
    const stationType = this.state.stationAutoSelects.find(
      s => s.key === stationTypeValue
    )
    this.props.onChange(stationTypeValue)
    if (this.props.onChangeObject) {
      this.props.onChangeObject(stationType)
    }
  }

  render() {
    if (!this.state.isLoaded) return <div />
    return (
      <Select
        {...this.props}
        onChange={this.handleChange}
        showSearch
        value={this.props.setKey ? this.props.stationAutoKey : this.props.value}
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
